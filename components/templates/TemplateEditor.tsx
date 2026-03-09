'use client';

import { useState } from 'react';
import { Star, Save, RotateCcw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Template {
    id: string;
    star_rating: number;
    message_text: string;
}

export default function TemplateEditor({ initialTemplates }: { initialTemplates: Template[] }) {
    const [templates, setTemplates] = useState(initialTemplates);
    const [loading, setLoading] = useState<string | null>(null);
    const supabase = createClient();

    const handleUpdate = async (id: string, text: string) => {
        setLoading(id);
        const { error } = await supabase
            .from('templates')
            .update({ message_text: text })
            .eq('id', id);

        if (error) {
            alert('Error updating template');
        } else {
            setTemplates(templates.map(t => t.id === id ? { ...t, message_text: text } : t));
        }
        setLoading(null);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[5, 4, 3, 2, 1].map((rating) => {
                const template = templates.find(t => t.star_rating === rating);
                if (!template) return null;

                return (
                    <div key={rating} className="rounded-xl border bg-white p-6 shadow-sm flex flex-col space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                                ))}
                            </div>
                            <span className="text-sm font-bold text-slate-500">{rating} Star Template</span>
                        </div>

                        <textarea
                            className="flex-1 w-full min-h-[150px] rounded-md border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                            defaultValue={template.message_text}
                            id={`template-${template.id}`}
                        />

                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    const el = document.getElementById(`template-${template.id}`) as HTMLTextAreaElement;
                                    handleUpdate(template.id, el.value);
                                }}
                                disabled={loading === template.id}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                            >
                                <Save className="h-4 w-4" />
                                {loading === template.id ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
