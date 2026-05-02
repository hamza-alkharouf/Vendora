'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../hooks/use-auth';
import { LoadingOverlay, Box } from '@mantine/core';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('ADMIN' | 'SELLER' | 'CUSTOMER')[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const isLoginPage = pathname.includes('/auth/login');

  useEffect(() => {
    if (!loading) {
      if (!user && !isLoginPage) {
        router.push(`/${locale}/auth/login`);
      } else if (user && allowedRoles && !allowedRoles.includes(user.role)) {
        router.push(`/${locale}`);
      }
    }
  }, [user, loading, router, pathname, locale, isLoginPage, JSON.stringify(allowedRoles)]);

  // If loading, show overlay
  if (loading) {
    return (
      <Box pos="relative" h="100vh">
        <LoadingOverlay visible={true} />
      </Box>
    );
  }

  // If on login page, or authenticated, show children
  if (isLoginPage || user) {
    return <>{children}</>;
  }

  // Fallback for unauthorized (while redirecting)
  return (
    <Box pos="relative" h="100vh">
      <LoadingOverlay visible={true} />
    </Box>
  );
}
