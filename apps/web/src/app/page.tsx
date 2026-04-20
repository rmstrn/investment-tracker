import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

// Keeping '/' as public route in middleware — page itself handles redirect via Clerk auth().
export default async function HomePage() {
  const { userId } = await auth();
  redirect(userId ? '/dashboard' : '/sign-in');
}
