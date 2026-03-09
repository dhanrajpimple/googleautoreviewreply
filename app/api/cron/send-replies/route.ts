import { createClient } from '@supabase/supabase-js';
import { postGoogleReply } from '@/lib/google/replies';
import { refreshAccessToken } from '@/lib/google/auth';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 1. Find all reviews where replied = false
        const { data: pendingReviews } = await supabaseAdmin
            .from('reviews')
            .select('*, businesses(*)')
            .eq('replied', false);

        if (!pendingReviews || pendingReviews.length === 0) {
            return NextResponse.json({ message: 'No pending reviews' });
        }

        const results = [];

        for (const review of pendingReviews) {
            const business = review.businesses;

            if (!business || !business.auto_reply_enabled || !business.is_active) {
                continue;
            }

            try {
                // 2. Refresh token if needed
                let accessToken = business.google_access_token;
                if (new Date(business.token_expires_at) <= new Date()) {
                    const { access_token, expires_in } = await refreshAccessToken(business.google_refresh_token);
                    accessToken = access_token;
                    await supabaseAdmin.from('businesses').update({
                        google_access_token: access_token,
                        token_expires_at: new Date(Date.now() + expires_in * 1000).toISOString(),
                    }).eq('id', business.id);
                }

                // 3. Find template for this star rating
                const { data: template } = await supabaseAdmin
                    .from('templates')
                    .select('message_text')
                    .eq('business_id', business.id)
                    .eq('star_rating', review.star_rating)
                    .eq('is_active', true)
                    .single();

                if (template) {
                    // 4. Post reply to Google
                    await postGoogleReply(
                        business.google_account_id,
                        business.google_location_id,
                        review.google_review_id,
                        template.message_text,
                        accessToken
                    );

                    // 5. Update review record
                    await supabaseAdmin
                        .from('reviews')
                        .update({
                            replied: true,
                            replied_at: new Date().toISOString(),
                            reply_message: template.message_text,
                        })
                        .eq('id', review.id);

                    results.push({ reviewId: review.id, status: 'replied' });
                } else {
                    results.push({ reviewId: review.id, status: 'no_template' });
                }
            } catch (err: any) {
                results.push({ reviewId: review.id, status: 'error', message: err.message });
            }
        }

        return NextResponse.json({ results });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
