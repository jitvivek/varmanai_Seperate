import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard' };

async function getUser() {
  const clerkKey = process.env.CLERK_SECRET_KEY || '';
  const isDevMode = !clerkKey || clerkKey.includes('dev_placeholder');

  if (isDevMode) {
    return { id: 'dev_user_local', email: 'dev@localhost' };
  }

  const { currentUser } = await import('@clerk/nextjs/server');
  return currentUser();
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) {
    const { redirect } = await import('next/navigation');
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-varman-ink">
      <aside className="fixed left-0 top-0 h-full w-64 bg-varman-ink-2 border-r border-varman-steel p-6 hidden md:block">
        <div className="font-display text-xl text-varman-cyan font-bold mb-8">VarmanAI</div>
        <nav className="space-y-2">
          <a href="/dashboard" className="block px-4 py-2 rounded-lg text-varman-mist hover:bg-varman-steel transition">Overview</a>
          <a href="/dashboard/usage" className="block px-4 py-2 rounded-lg text-varman-fog hover:bg-varman-steel transition">Usage</a>
          <a href="/dashboard/users" className="block px-4 py-2 rounded-lg text-varman-fog hover:bg-varman-steel transition">Users</a>
          <a href="/dashboard/api-keys" className="block px-4 py-2 rounded-lg text-varman-fog hover:bg-varman-steel transition">API Keys</a>
          <a href="/dashboard/billing" className="block px-4 py-2 rounded-lg text-varman-fog hover:bg-varman-steel transition">Billing</a>
          <a href="/dashboard/settings" className="block px-4 py-2 rounded-lg text-varman-fog hover:bg-varman-steel transition">Settings</a>
        </nav>
      </aside>
      <main className="md:ml-64 p-8">{children}</main>
    </div>
  );
}
