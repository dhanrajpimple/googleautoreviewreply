import { getGoogleAuthUrl } from '@/lib/google/auth';
import { NextResponse } from 'next/server';

export async function GET() {
    const url = getGoogleAuthUrl();
    return NextResponse.redirect(url);
}
