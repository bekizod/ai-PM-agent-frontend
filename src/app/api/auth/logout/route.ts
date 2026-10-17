import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('tpm_auth_session');
  return NextResponse.json({ success: true });
}
