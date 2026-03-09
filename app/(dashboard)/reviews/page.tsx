import { createClient } from '@/lib/supabase/server';
import { Star } from 'lucide-react';

export default async function ReviewsPage() {
    const supabase = createClient();

    const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .single();

    if (!business) return null;

    const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('business_id', business.id)
        .order('review_date', { ascending: false });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Manage Reviews</h1>
                <p className="text-slate-500">Track and manage all your Google Business reviews.</p>
            </div>

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700">Reviewer</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Rating</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 w-1/3">Comment</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Reply Sent</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {reviews && reviews.length > 0 ? reviews.map((review) => (
                                <tr key={review.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium">{review.reviewer_name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`h-3 w-3 ${i < review.star_rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="line-clamp-2 text-slate-600">{review.review_text || 'No comment provided.'}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${review.replied
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {review.replied ? 'Replied' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {review.replied ? (
                                            <p className="line-clamp-1 text-xs text-slate-500 italic max-w-[200px]" title={review.reply_message}>
                                                "{review.reply_message}"
                                            </p>
                                        ) : (
                                            <span className="text-slate-400 text-xs">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                        {new Date(review.review_date).toLocaleDateString()}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No reviews yet. Connect your Google profile and start receiving feedback!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
