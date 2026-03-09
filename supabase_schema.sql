-- Create tables
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT,
  google_place_id TEXT,
  google_account_id TEXT,
  google_location_id TEXT,
  google_access_token TEXT,
  google_refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  auto_reply_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  google_review_id TEXT UNIQUE,
  reviewer_name TEXT,
  star_rating INTEGER CHECK (star_rating >= 1 AND star_rating <= 5),
  review_text TEXT,
  review_date TIMESTAMP WITH TIME ZONE,
  replied BOOLEAN DEFAULT FALSE,
  replied_at TIMESTAMP WITH TIME ZONE,
  reply_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  star_rating INTEGER CHECK (star_rating >= 1 AND star_rating <= 5),
  message_text TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Policies for businesses
CREATE POLICY "Users can view their own businesses" ON businesses FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert their own businesses" ON businesses FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update their own businesses" ON businesses FOR UPDATE USING (auth.uid() = owner_id);

-- Policies for reviews
CREATE POLICY "Users can view reviews for their businesses" ON reviews FOR SELECT USING (
  EXISTS (SELECT 1 FROM businesses WHERE businesses.id = reviews.business_id AND businesses.owner_id = auth.uid())
);

-- Policies for templates
CREATE POLICY "Users can view templates for their businesses" ON templates FOR SELECT USING (
  EXISTS (SELECT 1 FROM businesses WHERE businesses.id = templates.business_id AND businesses.owner_id = auth.uid())
);
CREATE POLICY "Users can insert templates for their businesses" ON templates FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM businesses WHERE businesses.id = templates.business_id AND businesses.owner_id = auth.uid())
);
CREATE POLICY "Users can update templates for their businesses" ON templates FOR UPDATE USING (
  EXISTS (SELECT 1 FROM businesses WHERE businesses.id = templates.business_id AND businesses.owner_id = auth.uid())
);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
