import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=no_code`);
    }

    // Exchange code for tokens
    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
            grant_type: 'authorization_code',
        }),
    });

    const tokens = await response.json();

    if (!response.ok) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=token_exchange_failed`);
    }

    // Get User Account Info (Accounts and Locations)
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`);
    }

    // Fetch My Business accounts (using modern Account Management API)
    const accountsRes = await fetch('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!accountsRes.ok) {
        const errorBody = await accountsRes.text();
        console.error('Accounts Fetch Failed:', errorBody);

        let errorType = 'google_accounts_fetch_failed';
        try {
            const errorJson = JSON.parse(errorBody);
            if (accountsRes.status === 429 || errorJson.error?.status === 'RESOURCE_EXHAUSTED') {
                errorType = 'google_quota_exceeded';
            } else if (errorJson.error?.status === 'PERMISSION_DENIED' && errorBody.includes('mybusinessaccountmanagement.googleapis.com')) {
                errorType = 'google_api_disabled';
            }
        } catch (e) {
            // Not JSON, fall back to default error
        }

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=${errorType}`);
    }

    const accountsData = await accountsRes.json();

    if (!accountsData.accounts || accountsData.accounts.length === 0) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=no_google_business_account`);
    }

    const account = accountsData.accounts[0];
    const accountId = account.name.split('/')[1];

    // Fetch Locations (using modern Business Information API)
    // Note: readMask is required for this API
    const locationsRes = await fetch(`https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${accountId}/locations?readMask=name,title`, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!locationsRes.ok) {
        const errorBody = await locationsRes.text();
        console.error('Locations Fetch Failed:', errorBody);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=no_locations_found`);
    }

    const locationsData = await locationsRes.json();

    if (!locationsData.locations || locationsData.locations.length === 0) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=no_locations_found`);
    }

    const location = locationsData.locations[0];
    const locationId = location.name.split('/')[1]; // Format is "locations/id"

    // Save to businesses table
    const { data: business, error: businessError } = await supabase
        .from('businesses')
        .upsert({
            owner_id: user.id,
            business_name: location.title || location.locationName,
            google_account_id: accountId,
            google_location_id: locationId,
            google_access_token: tokens.access_token,
            google_refresh_token: tokens.refresh_token,
            token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        }, { onConflict: 'owner_id' })
        .select()
        .single();

    if (businessError) {
        console.error(businessError);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=db_save_failed`);
    }

    // Seed default templates if not exists
    const { data: existingTemplates } = await supabase
        .from('templates')
        .select('id')
        .eq('business_id', business.id);

    if (!existingTemplates || existingTemplates.length === 0) {
        const { DEFAULT_TEMPLATES } = await import('@/lib/templates/defaults');
        const templatesToInsert = DEFAULT_TEMPLATES.map(t => ({
            business_id: business.id,
            star_rating: t.star_rating,
            message_text: t.message_text,
        }));

        await supabase.from('templates').insert(templatesToInsert);
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
}
