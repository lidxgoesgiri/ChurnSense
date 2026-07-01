import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardClient } from './dashboard-client';

// Server-side auth gate: no session cookie -> back to the landing/login page.
export default async function DashboardPage() {
  const store = await cookies();
  const session = store.get('cs_session');
  if (!session?.value) {
    redirect('/');
  }
  const email = decodeURIComponent(session.value);
  return <DashboardClient email={email} />;
}
