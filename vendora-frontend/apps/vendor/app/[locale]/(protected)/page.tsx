'use client';

import { Paper, Title, Text, Group, SimpleGrid, Stack, Button, Badge, Table, ActionIcon, rem } from '@mantine/core';
import { 
  IconPackage, 
  IconShoppingCart, 
  IconCurrencyDollar, 
  IconTrendingUp,
  IconEye,
  IconEdit,
  IconPlus,
} from '@tabler/icons-react';
import { BarChart } from '@mantine/charts';
import { useTranslations } from 'next-intl';

const chartData = [
  { month: 'Jan', orders: 45 },
  { month: 'Feb', orders: 52 },
  { month: 'Mar', orders: 48 },
  { month: 'Apr', orders: 61 },
  { month: 'May', orders: 55 },
  { month: 'Jun', orders: 67 },
];

export default function VendorDashboard() {
  const t = useTranslations('Dashboard');

  const stats = [
    { title: t('stats.revenue'), value: '$0.00', icon: IconCurrencyDollar, color: 'vendora', diff: 0 },
    { title: t('stats.orders'), value: '0', icon: IconShoppingCart, color: 'blue', diff: 0 },
    { title: t('stats.products'), value: '0', icon: IconPackage, color: 'teal', diff: 0 },
    { title: t('stats.views'), value: '0', icon: IconTrendingUp, color: 'orange', diff: 0 },
  ];

  const recentOrders: any[] = []; 

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>{t('title')}</Title>
          <Text c="dimmed" size="sm">{t('welcome')}</Text>
        </div>
        <Button leftSection={<IconPlus size={18} />} color="vendora" radius="md">
          Add New Product
        </Button>
      </Group>
      
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        {stats.map((stat) => (
          <Paper key={stat.title} p="md" shadow="sm" radius="md" withBorder>
            <Group justify="space-between">
              <stat.icon size="1.8rem" color={`var(--mantine-color-${stat.color}-6)`} />
              <Badge 
                color={stat.diff > 0 ? 'teal' : stat.diff < 0 ? 'red' : 'gray'} 
                variant="light"
              >
                {stat.diff > 0 ? '+' : ''}{stat.diff}%
              </Badge>
            </Group>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="sm">
              {stat.title}
            </Text>
            <Text fw={700} size="xl">
              {stat.value}
            </Text>
          </Paper>
        ))}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        <Paper p="xl" shadow="sm" radius="md" withBorder>
          <Title order={4} mb="lg">{t('orderHistory')}</Title>
          <BarChart
            h={300}
            data={chartData}
            dataKey="month"
            series={[{ name: 'orders', color: 'vendora.6' }]}
          />
        </Paper>

        <Paper p="xl" shadow="sm" radius="md" withBorder>
          <Title order={4} mb="lg">{t('recentOrders')}</Title>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('table.orderId')}</Table.Th>
                <Table.Th>{t('table.customer')}</Table.Th>
                <Table.Th>{t('table.total')}</Table.Th>
                <Table.Th>{t('table.status')}</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <Table.Tr key={order.id}>
                    <Table.Td><Text size="sm" fw={500}>{order.id}</Text></Table.Td>
                    <Table.Td><Text size="sm">{order.customer}</Text></Table.Td>
                    <Table.Td><Text size="sm">{order.total}</Text></Table.Td>
                    <Table.Td>
                      <Badge 
                        variant="dot" 
                        color={order.status === 'Pending' ? 'orange' : order.status === 'Shipped' ? 'blue' : 'teal'}
                      >
                        {order.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={0} justify="flex-end">
                        <ActionIcon variant="subtle" color="gray">
                          <IconEye style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" color="gray">
                          <IconEdit style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text ta="center" c="dimmed" py="xl">{t('table.noOrders')}</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
          <Button variant="subtle" fullWidth mt="md">View All Orders</Button>
        </Paper>
      </SimpleGrid>
    </Stack>
  );
}
