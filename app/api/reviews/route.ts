import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = createClient();

    const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .single();

    if (!business) {
        return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('business_id', business.id)
        .order('review_date', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(reviews);
}
