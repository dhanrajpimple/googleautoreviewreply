import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
}

export default function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h3 className="mt-1 text-2xl font-bold text-slate-900">{value}</h3>
                    {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
                </div>
                <div className="rounded-full bg-blue-50 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
            </div>
        </div>
    );
}
