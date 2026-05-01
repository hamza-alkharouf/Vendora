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
  IconDashboard,
  IconList,
  IconTruck,
  IconSettings
} from '@tabler/icons-react';
import { DashboardLayout } from '@repo/ui/layouts/dashboard-layout';
import { BarChart } from '@mantine/charts';

const stats = [
  { title: 'Store Revenue', value: '$4,250', icon: IconCurrencyDollar, color: 'vendora', diff: 12 },
  { title: 'Orders Today', value: '18', icon: IconShoppingCart, color: 'blue', diff: -5 },
  { title: 'Active Products', value: '42', icon: IconPackage, color: 'teal', diff: 0 },
  { title: 'Store Views', value: '1,504', icon: IconTrendingUp, color: 'orange', diff: 18 },
];

const chartData = [
  { month: 'Jan', orders: 45 },
  { month: 'Feb', orders: 52 },
  { month: 'Mar', orders: 48 },
  { month: 'Apr', orders: 61 },
  { month: 'May', orders: 55 },
  { month: 'Jun', orders: 67 },
];

const vendorLinks = [
  { label: 'Overview', icon: IconDashboard, link: '/', active: true },
  { label: 'My Products', icon: IconPackage, link: '/products' },
  { label: 'Orders', icon: IconList, link: '/orders' },
  { label: 'Shipping', icon: IconTruck, link: '/shipping' },
  { label: 'Settings', icon: IconSettings, link: '/settings' },
];

const recentOrders = [
  { id: '#ORD-123', customer: 'Ahmed Ali', total: '$120.00', status: 'Pending' },
  { id: '#ORD-124', customer: 'Sara Hassan', total: '$45.00', status: 'Shipped' },
  { id: '#ORD-125', customer: 'John Doe', total: '$89.99', status: 'Delivered' },
];

export default function VendorDashboard() {
  return (
    <DashboardLayout 
      user={{ name: 'Mega Store', role: 'Premium Seller' }}
      links={vendorLinks}
    >
      <Stack gap="lg">
        <Group justify="space-between">
          <div>
            <Title order={2}>Seller Central</Title>
            <Text c="dimmed" size="sm">Welcome back! Here is what is happening with your store today.</Text>
          </div>
          <Button leftSection={<IconPlus size={18} />} color="vendora" radius="md">
            Add New Product
          </Button>
        </Group>
        
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
          {stats.map((stat) => (
            <Paper key={stat.title} p="md" shadow="sm" radius="md">
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
          <Paper p="xl" shadow="sm" radius="md">
            <Title order={4} mb="lg">Order History</Title>
            <BarChart
              h={300}
              data={chartData}
              dataKey="month"
              series={[{ name: 'orders', color: 'vendora.6' }]}
            />
          </Paper>

          <Paper p="xl" shadow="sm" radius="md">
            <Title order={4} mb="lg">Recent Orders</Title>
            <Table verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Order ID</Table.Th>
                  <Table.Th>Customer</Table.Th>
                  <Table.Th>Total</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {recentOrders.map((order) => (
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
                ))}
              </Table.Tbody>
            </Table>
            <Button variant="subtle" fullWidth mt="md">View All Orders</Button>
          </Paper>
        </SimpleGrid>
      </Stack>
    </DashboardLayout>
  );
}
