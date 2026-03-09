import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = createClient();
    const { data: templates, error } = await supabase
        .from('templates')
        .select('*');

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(templates);
}

export async function PATCH(request: Request) {
    const supabase = createClient();
    const body = await request.json();
    const { id, message_text } = body;

    const { data, error } = await supabase
        .from('templates')
        .update({ message_text })
        .eq('id', id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
