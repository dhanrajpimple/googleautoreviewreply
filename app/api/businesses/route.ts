import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = createClient();
    const { data: business, error } = await supabase
        .from('businesses')
        .select('*')
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(business);
}

export async function PATCH(request: Request) {
    const supabase = createClient();
    const body = await request.json();

    const { data, error } = await supabase
        .from('businesses')
        .update(body)
        .eq('owner_id', (await supabase.auth.getUser()).data.user?.id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
