import { createClient } from '@supabase/supabase-js';
import { fetchGoogleReviews } from '@/lib/google/reviews';
import { refreshAccessToken } from '@/lib/google/auth';
import { NextResponse } from 'next/server';

// Use service role for cron jobs to bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
    // Verify Cron Secret
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 1. Fetch all active businesses
        const { data: businesses } = await supabaseAdmin
            .from('businesses')
            .select('*')
            .eq('is_active', true);

        if (!businesses) return NextResponse.json({ message: 'No active businesses' });

        const results = [];

        for (const business of businesses) {
            try {
                let accessToken = business.google_access_token;

                // Refresh token if needed
                if (new Date(business.token_expires_at) <= new Date()) {
                    const { access_token, expires_in } = await refreshAccessToken(business.google_refresh_token);
                    accessToken = access_token;

                    await supabaseAdmin
                        .from('businesses')
                        .update({
                            google_access_token: access_token,
                            token_expires_at: new Date(Date.now() + expires_in * 1000).toISOString(),
                        })
                        .eq('id', business.id);
                }

                // 2. Fetch reviews from Google
                const reviews = await fetchGoogleReviews(
                    business.google_account_id,
                    business.google_location_id,
                    accessToken
                );

                // 3. Filter and insert new reviews
                for (const review of reviews) {
                    const { data: existing } = await supabaseAdmin
                        .from('reviews')
                        .select('id')
                        .eq('google_review_id', review.reviewId)
                        .single();

                    if (!existing) {
                        await supabaseAdmin.from('reviews').insert({
                            business_id: business.id,
                            google_review_id: review.reviewId,
                            reviewer_name: review.reviewer.displayName,
                            star_rating: parseInt(review.starRating.replace('STAR_RATING_', '')),
                            review_text: review.comment,
                            review_date: review.createTime,
                            replied: false,
                        });
                    }
                }

                results.push({ businessId: business.id, status: 'success', count: reviews.length });
            } catch (err: any) {
                results.push({ businessId: business.id, status: 'error', message: err.message });
            }
        }

        return NextResponse.json({ results });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
