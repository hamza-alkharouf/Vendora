'use client';

import { AuthGuard } from '@repo/ui';
import { DashboardLayout } from '@repo/ui/layouts/dashboard-layout';
import { useTranslations } from 'next-intl';
import { 
  IconDashboard, 
  IconPackage, 
  IconList, 
  IconTruck, 
  IconSettings
} from '@tabler/icons-react';

export default function VendorProtectedLayout({ children }: { children: React.ReactNode }) {
  const tNav = useTranslations('Navigation');

  const vendorLinks = [
    { label: tNav('overview'), icon: IconDashboard, link: '/' },
    { label: tNav('products'), icon: IconPackage, link: '/products' },
    { label: tNav('orders'), icon: IconList, link: '/orders' },
    { label: tNav('shipping'), icon: IconTruck, link: '/shipping' },
    { label: tNav('settings'), icon: IconSettings, link: '/settings' },
  ];

  return (
    <AuthGuard allowedRoles={['SELLER', 'ADMIN']}>
      <DashboardLayout 
        user={{ name: 'Mega Store', role: 'Premium Seller' }}
        links={vendorLinks}
      >
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}
