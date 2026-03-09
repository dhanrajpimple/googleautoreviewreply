import { createClient } from '@/lib/supabase/server';
import StatsCard from '@/components/dashboard/StatsCard';
import { MessageSquare, CheckCircle, Star, Clock } from 'lucide-react';
import Link from 'next/link';
import ReviewChart from '@/components/dashboard/ReviewChart';
import ErrorNotification from '@/components/dashboard/ErrorNotification';

export default async function DashboardPage() {
    const supabase = createClient();

    // Get business for this user
    const { data: business } = await supabase
        .from('businesses')
        .select('*')
        .single();

    if (!business) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 max-w-2xl mx-auto">
                <ErrorNotification />
                <div className="bg-blue-50 p-6 rounded-full">
                    <Star className="h-12 w-12 text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Welcome to ReviewReply!</h2>
                    <p className="text-slate-500 mt-2 max-w-md">
                        Connect your Google Business Profile to start automatically replying to reviews.
                    </p>
                </div>
                <Link
                    href="/connect"
                    className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                    Connect Google Business Profile
                </Link>
            </div>
        );
    }

    // Fetch stats (mocking or simple count for now)
    const { count: totalReviews } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', business.id);

    const { count: autoRepliesSent } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', business.id)
        .eq('replied', true);

    const { count: pendingReplies } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', business.id)
        .eq('replied', false);

    // Recent reviews
    const { data: recentReviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('business_id', business.id)
        .order('review_date', { ascending: false })
        .limit(5);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                <p className="text-slate-500">Welcome back! Here's what's happening with {business.business_name}.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Reviews"
                    value={totalReviews || 0}
                    icon={MessageSquare}
                />
                <StatsCard
                    title="Auto Replies Sent"
                    value={autoRepliesSent || 0}
                    icon={CheckCircle}
                />
                <StatsCard
                    title="Average Rating"
                    value="4.8"
                    icon={Star}
                />
                <StatsCard
                    title="Pending Replies"
                    value={pendingReplies || 0}
                    icon={Clock}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Recent Reviews</h2>
                        <Link href="/reviews" className="text-sm font-medium text-primary hover:underline">View All</Link>
                    </div>
                    <div className="rounded-xl border bg-white shadow-sm overflow-hidden text-sm">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 font-semibold text-slate-700">Reviewer</th>
                                    <th className="px-6 py-3 font-semibold text-slate-700">Rating</th>
                                    <th className="px-6 py-3 font-semibold text-slate-700">Status</th>
                                    <th className="px-6 py-3 font-semibold text-slate-700">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {recentReviews && recentReviews.length > 0 ? recentReviews.map((review) => (
                                    <tr key={review.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium">{review.reviewer_name}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`h-3 w-3 ${i < review.star_rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${review.replied
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {review.replied ? 'Replied' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {new Date(review.review_date).toLocaleDateString()}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                                            No reviews found. They will appear here once customers leave feedback!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold">Quick Settings</h2>
                    <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Auto-Reply Status</p>
                                <p className="text-sm text-slate-500">{business.auto_reply_enabled ? 'Enabled' : 'Disabled'}</p>
                            </div>
                            <div className={`h-6 w-11 rounded-full relative transition-colors ${business.auto_reply_enabled ? 'bg-primary' : 'bg-slate-200'}`}>
                                <div className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${business.auto_reply_enabled ? 'translate-x-5' : ''}`}></div>
                            </div>
                        </div>
                        <div className="pt-4 border-t">
                            <Link href="/templates" className="text-sm font-medium text-primary hover:underline">Edit Reply Templates →</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
