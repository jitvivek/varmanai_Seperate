import type { Metadata } from 'next';
import ClerkConnect from './ClerkConnect';
import DevConnect from './DevConnect';

export const metadata: Metadata = { title: 'Connect Extension' };

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
const useClerk =
  clerkKey.startsWith('pk_test_') && !clerkKey.includes('placeholder') && clerkKey.length > 20;

export default function ConnectExtensionPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-varman-ink px-4">
      {useClerk ? <ClerkConnect /> : <DevConnect />}
    </div>
  );
}
