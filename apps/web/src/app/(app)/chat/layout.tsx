import type { ReactNode } from 'react';

export default function ChatLayout({ children }: { children: ReactNode }) {
  return <div className="flex h-[calc(100vh-56px)] w-full">{children}</div>;
}
