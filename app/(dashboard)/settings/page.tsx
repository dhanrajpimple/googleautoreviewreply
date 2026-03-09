import { createClient } from '@/lib/supabase/server';
import { Settings as SettingsIcon, Link as LinkIcon, Trash2, Power } from 'lucide-react';

export default async function SettingsPage() {
    const supabase = createClient();

    const { data: business } = await supabase
        .from('businesses')
        .select('*')
        .single();

    if (!business) return null;

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold">Business Settings</h1>
                <p className="text-slate-500">Manage your business profile and automation settings.</p>
            </div>

            {/* General Settings */}
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="p-6 border-b bg-slate-50 flex items-center gap-2">
                    <SettingsIcon className="h-5 w-5 text-slate-500" />
                    <h2 className="font-bold">General Configuration</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-slate-900">Auto-Reply Automation</p>
                            <p className="text-sm text-slate-500">Automatically reply to all new incoming reviews based on your templates.</p>
                        </div>
                        <button className={`h-6 w-11 rounded-full relative transition-colors ${business.auto_reply_enabled ? 'bg-primary' : 'bg-slate-200'}`}>
                            <div className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${business.auto_reply_enabled ? 'translate-x-5' : ''}`}></div>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Business Name</label>
                            <input
                                className="w-full rounded-md border border-slate-200 p-2 text-sm bg-slate-50"
                                value={business.business_name}
                                disabled
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Connection Settings */}
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="p-6 border-b bg-slate-50 flex items-center gap-2">
                    <LinkIcon className="h-5 w-5 text-slate-500" />
                    <h2 className="font-bold">Connected Google Account</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <LinkIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900">Google Business Profile Connected</p>
                                <p className="text-sm text-slate-500">Account ID: {business.google_account_id}</p>
                            </div>
                        </div>
                        <button className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-2 px-4 py-2 rounded-md border border-red-100 hover:bg-red-50 transition-colors">
                            <Trash2 className="h-4 w-4" />
                            Disconnect Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
