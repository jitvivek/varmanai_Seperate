import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Sign Up' };

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
const useClerk = clerkKey.startsWith('pk_test_') && !clerkKey.includes('placeholder') && clerkKey.length > 20;

export default async function SignUpPage() {
  if (!useClerk) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-varman-ink">
        <div className="text-center p-8 rounded-xl border border-varman-steel bg-varman-ink-2">
          <h1 className="text-varman-mist font-display text-2xl mb-4">Dev Mode</h1>
          <p className="text-varman-fog">
            Auth is disabled — no Clerk keys configured.<br />
            The backend auto-authenticates as <code className="text-varman-cyan">dev_user_local</code>.
          </p>
        </div>
      </div>
    );
  }

  const { SignUp } = await import('@clerk/nextjs');
  return (
    <div className="min-h-screen flex items-center justify-center bg-varman-ink">
      <SignUp />
    </div>
  );
}
