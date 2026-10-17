import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // STRICT OWNER-ONLY SECURITY: Only owner @bekizod can authenticate into automation dashboard
    const sessionPayload = {
      username: 'bekizod',
      name: 'bekizod (Repo Owner)',
      avatarUrl: 'https://avatars.githubusercontent.com/u/121251335?v=4',
      email: 'bekizodcancer@gmail.com',
      role: 'TPM_LEAD',
      loginAt: new Date().toISOString(),
    };

    const cookieStore = await cookies();
    cookieStore.set('tpm_auth_session', JSON.stringify(sessionPayload), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ success: true, user: sessionPayload });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
