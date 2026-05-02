'use client';

import { AuthGuard } from '@repo/ui';
import { DashboardLayout } from '@repo/ui/layouts/dashboard-layout';
import { useTranslations } from 'next-intl';
import { 
  IconDashboard, 
  IconBuildingStore, 
  IconUsers, 
  IconSettings,
  IconClockHour4
} from '@tabler/icons-react';

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const tNav = useTranslations('Navigation');

  const adminLinks = [
    { label: tNav('dashboard'), icon: IconDashboard, link: '/' },
    { label: tNav('sellers'), icon: IconBuildingStore, link: '/sellers' },
    { label: tNav('stores'), icon: IconBuildingStore, link: '/stores' },
    { label: tNav('requests'), icon: IconClockHour4, link: '/requests' },
    { label: tNav('customers'), icon: IconUsers, link: '/customers' },
    { label: tNav('settings'), icon: IconSettings, link: '/settings' },
  ];

  return (
    <AuthGuard allowedRoles={['ADMIN']}>
      <DashboardLayout 
        user={{ name: 'Admin', role: 'Super Admin' }}
        links={adminLinks}
      >
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}
