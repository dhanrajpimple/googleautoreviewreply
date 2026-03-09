import { createClient } from '@/lib/supabase/server';
import TemplateEditor from '@/components/templates/TemplateEditor';

export default async function TemplatesPage() {
    const supabase = createClient();

    const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .single();

    if (!business) return null;

    const { data: templates } = await supabase
        .from('templates')
        .select('*')
        .eq('business_id', business.id)
        .order('star_rating', { ascending: false });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Reply Templates</h1>
                <p className="text-slate-500">Customize the automatic replies sent to customers based on their star rating.</p>
            </div>

            <TemplateEditor initialTemplates={templates || []} />
        </div>
    );
}
