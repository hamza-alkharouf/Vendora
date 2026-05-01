'use client';

import { useState, useEffect } from 'react';
import { Title, Stack, Paper, Table, Group, Button, Text, Badge, ActionIcon, LoadingOverlay, Image } from '@mantine/core';
import { IconPlus, IconEdit, IconTrash, IconExternalLink, IconDashboard, IconPackage, IconList, IconTruck, IconSettings } from '@tabler/icons-react';
import { DashboardLayout } from '@repo/ui/layouts/dashboard-layout';
import { notifications } from '@mantine/notifications';
import api from '@repo/api';
import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/routing';

const vendorLinks = [
  { label: 'overview', icon: IconDashboard, link: '/' },
  { label: 'products', icon: IconPackage, link: '/products', active: true },
  { label: 'orders', icon: IconList, link: '/orders' },
  { label: 'shipping', icon: IconTruck, link: '/shipping' },
  { label: 'settings', icon: IconSettings, link: '/settings' },
];

interface Product {
  id: string;
  title: { ar: string; en: string; he: string };
  price: number;
  status: 'ACTIVE' | 'DRAFT' | 'OUT_OF_STOCK';
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const tNav = useTranslations('Navigation');
  const locale = useTranslations()('locale') as 'ar' | 'en' | 'he';

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products/my-products');
      setProducts(response.data);
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to fetch products.', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  return (
    <DashboardLayout 
      user={{ name: 'Mega Store', role: 'Premium Seller' }} 
      links={vendorLinks.map(l => ({ ...l, label: tNav(l.label as any) }))}
    >
      <Stack gap="lg">
        <Group justify="space-between">
          <div>
            <Title order={2}>My Products</Title>
            <Text c="dimmed">Manage your inventory and listing details.</Text>
          </div>
          <Button 
            component={Link} 
            href="/products/new" 
            leftSection={<IconPlus size={18} />} 
            color="vendora"
          >
            Add New Product
          </Button>
        </Group>

        <Paper p="md" withBorder radius="md" pos="relative">
          <LoadingOverlay visible={loading} />
          <Table verticalSpacing="md" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Product</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Created At</Table.Th>
                <Table.Th ta="right">Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <Table.Tr key={product.id}>
                    <Table.Td>
                      <Group gap="sm">
                        <Paper withBorder radius="xs" w={40} h={40} bg="gray.1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <IconPackage size={20} color="var(--mantine-color-gray-5)" />
                        </Paper>
                        <div>
                          <Text size="sm" fw={500}>{product.title[locale] || product.title.en}</Text>
                          <Text size="xs" c="dimmed">ID: {product.id.slice(-6)}</Text>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={700} c="vendora.7">${product.price.toFixed(2)}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color="teal" variant="light">Active</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{new Date(product.createdAt).toLocaleDateString()}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs" justify="flex-end">
                        <ActionIcon variant="light" color="blue" title="Edit">
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon variant="light" color="red" title="Delete">
                          <IconTrash size={16} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" color="gray" title="View Storefront">
                          <IconExternalLink size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={5} ta="center" py="xl">
                    <Stack align="center" gap="xs">
                       <IconPackage size={40} color="var(--mantine-color-gray-3)" />
                       <Text c="dimmed">No products found yet.</Text>
                       <Button variant="subtle" size="xs" component={Link} href="/products/new">Create your first product</Button>
                    </Stack>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Paper>
      </Stack>
    </DashboardLayout>
  );
}
