'use client';

import { useSearchParams } from 'next/navigation';
import { AlertTriangle, ExternalLink, Info } from 'lucide-react';

export default function ErrorNotification() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    if (!error) return null;

    const errorMessages: Record<string, { title: string; message: string; action?: React.ReactNode }> = {
        'google_api_disabled': {
            title: 'Google API Not Enabled',
            message: 'The "My Business Account Management API" is not enabled in your Google Cloud Project. This is required to connect your account.',
            action: (
                <a
                    href="https://console.cloud.google.com/apis/library/mybusinessaccountmanagement.googleapis.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-amber-900 border-b border-amber-900/30 hover:border-amber-900 transition-colors"
                >
                    Enable API in Google Cloud <ExternalLink className="h-3 w-3" />
                </a>
            )
        },
        'google_quota_exceeded': {
            title: 'Google API Quota Limit 0',
            message: 'Your Google Cloud Project has been granted 0 quota for the My Business APIs. This is a common security restriction by Google for new projects.',
            action: (
                <div className="flex flex-col gap-3 mt-4">
                    <a
                        href="https://developers.google.com/my-business/content/prereqs#request-access"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900 bg-amber-200/50 px-3 py-2 rounded-lg hover:bg-amber-200 transition-colors w-fit"
                    >
                        Request API Access from Google <ExternalLink className="h-3 w-3" />
                    </a>
                    <p className="text-xs text-amber-800/60 italic">
                        Note: Google usually takes 1-2 business days to approve these requests.
                    </p>
                </div>
            )
        },
        'token_exchange_failed': {
            title: 'Authentication Failed',
            message: 'We couldn\'t exchange the authorization code for an access token. Please try again.',
        },
        'no_google_business_account': {
            title: 'No Business Account Found',
            message: 'We couldn\'t find any Google Business accounts associated with your Google profile.',
        },
        'no_locations_found': {
            title: 'No Locations Found',
            message: 'Your Google Business account doesn\'t have any locations set up yet.',
        },
        'db_save_failed': {
            title: 'Database Error',
            message: 'Failed to save your business connection. Please try again later.',
        }
    };

    const errorDetail = errorMessages[error] || {
        title: 'An error occurred',
        message: `Something went wrong during the connection process: ${error}`
    };

    return (
        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex gap-4">
                <div className="bg-amber-100 p-2 rounded-lg h-fit">
                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <div className="space-y-1">
                    <h3 className="font-bold text-lg leading-none">{errorDetail.title}</h3>
                    <p className="text-sm text-amber-800/80 max-w-2xl">{errorDetail.message}</p>
                    {errorDetail.action}
                </div>
            </div>
            {error === 'google_api_disabled' && (
                <div className="mt-4 pt-4 border-t border-amber-200/50 flex gap-3 text-sm text-amber-800/70">
                    <Info className="h-4 w-4 shrink-0 mt-0.5" />
                    <p>After enabling the API, please wait 1-2 minutes for Google to update before trying to connect again.</p>
                </div>
            )}
        </div>
    );
}
