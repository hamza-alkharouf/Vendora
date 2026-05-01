'use client';

import { Paper, Title, Text, Group, SimpleGrid, Stack } from '@mantine/core';
import { 
  IconDashboard, 
  IconBuildingStore, 
  IconUsers, 
  IconShoppingCart, 
  IconCurrencyDollar, 
  IconSettings 
} from '@tabler/icons-react';
import { DashboardLayout } from '@repo/ui/layouts/dashboard-layout';
import { AreaChart } from '@mantine/charts';
import { useTranslations } from 'next-intl';

const data = [
  { date: 'Jan', sales: 2500 },
  { date: 'Feb', sales: 3200 },
  { date: 'Mar', sales: 2800 },
  { date: 'Apr', sales: 4500 },
  { date: 'May', sales: 4800 },
  { date: 'Jun', sales: 6000 },
];

export default function AdminDashboard() {
  const t = useTranslations('Dashboard');
  const tNav = useTranslations('Navigation');

  const adminLinks = [
    { label: tNav('dashboard'), icon: IconDashboard, link: '/', active: true },
    { label: tNav('stores'), icon: IconBuildingStore, link: '/stores' },
    { label: tNav('users'), icon: IconUsers, link: '/users' },
    { label: tNav('settings'), icon: IconSettings, link: '/settings' },
  ];

  const stats = [
    { title: t('stats.sales'), value: '$0.00', icon: <IconCurrencyDollar />, color: 'vendora' },
    { title: t('stats.stores'), value: '0', icon: <IconBuildingStore />, color: 'blue' },
    { title: t('stats.customers'), value: '0', icon: <IconUsers />, color: 'teal' },
    { title: t('stats.orders'), value: '0', icon: <IconShoppingCart />, color: 'orange' },
  ];

  return (
    <DashboardLayout 
      user={{ name: 'Admin Name', role: 'Super Admin' }}
      links={adminLinks}
    >
      <Stack gap="lg">
        <Title order={2}>{t('title')}</Title>
        
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
          {stats.map((stat) => (
            <Paper key={stat.title} p="md" shadow="sm">
              <Group justify="space-between">
                <div>
                  <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                    {stat.title}
                  </Text>
                  <Text fw={700} size="xl">
                    {stat.value}
                  </Text>
                </div>
                <ThemeIcon color={stat.color} />
              </Group>
            </Paper>
          ))}
        </SimpleGrid>

        <Paper p="xl" shadow="sm">
          <Title order={4} mb="lg">{t('revenueGrowth')}</Title>
          <AreaChart
            h={300}
            data={data}
            dataKey="date"
            series={[{ name: 'sales', color: 'vendora.6' }]}
            curveType="linear"
          />
        </Paper>
      </Stack>
    </DashboardLayout>
  );
}

function ThemeIcon({ color }: { color: string }) {
   // Fallback since icons are passed as elements now
   return <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: `var(--mantine-color-${color}-light)` }} />;
}
