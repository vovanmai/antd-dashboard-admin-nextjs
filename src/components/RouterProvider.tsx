'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { _initRouter } from '@/lib/router';

export default function RouterProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    _initRouter(router);
  }, [router]);

  return <>{children}</>;
}
