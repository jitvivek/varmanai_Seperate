'use client';
 
import { useAuth, useUser } from '@clerk/nextjs';
import { SignIn } from '@clerk/nextjs';
import ConnectPanel from './ConnectPanel';
 
/**
* Clerk-enabled connect flow. Shows sign-in (email + Google, configured in
* Clerk) when signed out; runs the key handoff once signed in. Only rendered
* when Clerk is configured, so the hooks always run under a ClerkProvider.
*/
export default function ClerkConnect() {
  const { getToken } = useAuth();
  const { user } = useUser();
 
  if (!user) {
    return (
<div className="text-center">
<h1 className="mb-2 font-display text-2xl text-varman-mist">Connect your extension</h1>
<p className="mb-6 text-sm text-varman-fog">
          Sign in with email or Google to link the VarmanAI extension to your account.
</p>
<SignIn routing="hash" />
</div>
    );
  }
 
  return <ConnectPanel getToken={() => getToken()} />;
}
