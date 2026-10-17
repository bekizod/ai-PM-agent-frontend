import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/github';

  if (!clientId) {
    return NextResponse.redirect(new URL('/login?error=missing_credentials', request.url));
  }

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri,
  )}&scope=read:user,repo`;

  return NextResponse.redirect(githubAuthUrl);
}
