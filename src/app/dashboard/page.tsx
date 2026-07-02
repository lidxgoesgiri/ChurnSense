import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { DashboardClient } from './dashboard-client';

// Server-side auth gate: no valid signed session cookie -> back to login.
export default async function DashboardPage() {
  const email = await getSession();
  if (!email) {
    redirect('/');
  }
  return <DashboardClient email={email} />;
}
