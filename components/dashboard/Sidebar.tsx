'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    MessageSquare,
    Settings,
    Link as LinkIcon,
    FileText,
    LogOut
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const menuItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Reviews', href: '/reviews', icon: MessageSquare },
    { name: 'Templates', href: '/templates', icon: FileText },
    { name: 'Connect', href: '/connect', icon: LinkIcon },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white transition-transform">
            <div className="flex h-full flex-col px-3 py-4">
                <div className="mb-10 px-2 lg:px-4">
                    <Link href="/dashboard" className="text-xl font-bold text-primary">
                        ReviewReply
                    </Link>
                </div>
                <nav className="flex-1 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                                        ? 'bg-primary text-white'
                                        : 'text-gray-700 hover:bg-slate-100'
                                    }`}
                            >
                                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="mt-auto border-t pt-4">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Logout
                    </button>
                </div>
            </div>
        </aside>
    );
}
