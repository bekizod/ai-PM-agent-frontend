import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenRes.json();
    if (tokenData.error || !tokenData.access_token) {
      return NextResponse.redirect(new URL(`/login?error=${tokenData.error || 'auth_failed'}`, request.url));
    }

    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/json',
      },
    });

    const userData = await userRes.json();
    const isOwner = userData.login?.toLowerCase() === 'bekizod';

    // STRICT OWNER-ONLY SECURITY: Non-owners are denied login access to automation orchestrator
    if (!isOwner) {
      return NextResponse.redirect(
        new URL(`/login?error=unauthorized_not_owner&user=${encodeURIComponent(userData.login || 'user')}`, request.url)
      );
    }

    const sessionPayload = {
      username: userData.login,
      name: userData.name || userData.login,
      avatarUrl: userData.avatar_url,
      email: userData.email || 'bekizodcancer@gmail.com',
      role: 'TPM_LEAD',
      accessToken: tokenData.access_token,
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

    return NextResponse.redirect(new URL('/', request.url));
  } catch (err) {
    console.error('GitHub OAuth callback error:', err);
    return NextResponse.redirect(new URL('/login?error=server_error', request.url));
  }
}
