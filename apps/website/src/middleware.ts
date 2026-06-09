import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const clerkSecretKey = process.env.CLERK_SECRET_KEY ?? '';
const isDev = clerkSecretKey.includes('dev_placeholder') || !clerkSecretKey;

export default async function middleware(req: NextRequest) {
  // Skip Clerk entirely when running without real keys
  if (isDev) {
    return NextResponse.next();
  }

  // Dynamic import so Clerk doesn't crash at load time without keys
  const { clerkMiddleware, createRouteMatcher } = await import('@clerk/nextjs/server');
  const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

  return clerkMiddleware(async (auth, request) => {
    if (isProtectedRoute(request)) {
      await auth.protect();
    }
  })(req, {} as never);
}

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)'],
};
