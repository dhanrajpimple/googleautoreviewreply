import { createClient } from '@/lib/supabase/server';
import { Link as LinkIcon, CheckCircle, Info } from 'lucide-react';
import Link from 'next/link';
import ErrorNotification from '@/components/dashboard/ErrorNotification';

export default async function ConnectPage() {
    const supabase = createClient();

    const { data: business } = await supabase
        .from('businesses')
        .select('*')
        .single();

    return (
        <div className="space-y-8 max-w-4xl">
            <ErrorNotification />
            <div>
                <h1 className="text-2xl font-bold">Connect Google Business</h1>
                <p className="text-slate-500">Enable ReviewReply to access and reply to your reviews.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
                        <h2 className="text-lg font-bold">Connection Steps</h2>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs shrink-0 mt-0.5">1</div>
                                <div>
                                    <p className="font-semibold text-sm">Sign in with Google</p>
                                    <p className="text-xs text-slate-500">Authorize ReviewReply to manage your business reviews.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs shrink-0 mt-0.5">2</div>
                                <div>
                                    <p className="font-semibold text-sm">Select Your Location</p>
                                    <p className="text-xs text-slate-500">Pick the business location you want to monitor.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs shrink-0 mt-0.5">3</div>
                                <div>
                                    <p className="font-semibold text-sm">Start Auto-Replying</p>
                                    <p className="text-xs text-slate-500">Your predefined messages will be sent automatically.</p>
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/api/auth/google"
                            className="flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 py-3 px-4 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                        >
                            <img src="https://www.google.com/favicon.ico" className="h-4 w-4" alt="Google" />
                            Connect Google Business Profile
                        </Link>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3">
                        <Info className="h-5 w-5 text-blue-500 shrink-0" />
                        <p className="text-sm text-blue-700">
                            ReviewReply uses the official Google My Business API. We only request permissions necessary to read and reply to your reviews.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border bg-white p-6 shadow-sm flex flex-col items-center text-center space-y-4">
                        <div className={`h-16 w-16 rounded-full flex items-center justify-center ${business ? 'bg-green-100' : 'bg-slate-100'}`}>
                            {business ? <CheckCircle className="h-8 w-8 text-green-600" /> : <LinkIcon className="h-8 w-8 text-slate-400" />}
                        </div>
                        <div>
                            <h3 className="font-bold">{business ? 'Connected Successfully' : 'Not Connected'}</h3>
                            <p className="text-sm text-slate-500 mt-1">
                                {business
                                    ? `You are connected to "${business.business_name}".`
                                    : 'Your Google Business Profile is not yet connected.'}
                            </p>
                        </div>
                        {business && (
                            <div className="pt-4 w-full">
                                <div className="bg-slate-50 rounded-lg p-3 text-left">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Location</p>
                                    <p className="text-sm font-medium mt-1">{business.business_name}</p>
                                    <p className="text-xs text-slate-500 mt-1">ID: {business.google_location_id}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
