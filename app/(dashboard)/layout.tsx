import Sidebar from '@/components/dashboard/Sidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <div className="pl-64">
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
