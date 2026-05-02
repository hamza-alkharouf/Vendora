'use client';

import { useState, useEffect } from 'react';
import { Title, Stack, Paper, Table, Badge, Group, ActionIcon, Button, Text, LoadingOverlay, rem } from '@mantine/core';
import { IconCheck, IconX, IconEye, IconDashboard, IconBuildingStore, IconUsers, IconSettings } from '@tabler/icons-react';
import { DashboardLayout } from '@repo/ui/layouts/dashboard-layout';
import { notifications } from '@mantine/notifications';
import api from '@repo/api';
import { useTranslations } from 'next-intl';

const adminLinks = [
  { label: 'Dashboard', icon: IconDashboard, link: '/' },
  { label: 'Stores', icon: IconBuildingStore, link: '/stores', active: true },
  { label: 'Users', icon: IconUsers, link: '/users' },
  { label: 'Settings', icon: IconSettings, link: '/settings' },
];

interface Store {
  id: string;
  name: { ar: string; en: string; he: string };
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  contactPhone: string;
  createdAt: string;
}

export default function StoreApprovalPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const tNav = useTranslations('Navigation');
  const locale = useTranslations()('locale') as 'ar' | 'en' | 'he'; // Get locale string

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await api.get('/stores?status=PENDING_APPROVAL');
      setStores(response.data);
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to fetch stores.', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStores(); }, []);

  const handleStatusChange = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await api.patch(`/stores/${id}/status`, { status });
      notifications.show({ title: 'Success', message: `Store ${status.toLowerCase()} successfully.`, color: 'teal' });
      fetchStores();
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Operation failed.', color: 'red' });
    }
  };

  return (
    <DashboardLayout 
      user={{ name: 'Admin', role: 'Super Admin' }} 
      links={adminLinks.map(l => ({ ...l, label: tNav(l.label.toLowerCase() as any) }))}
    >
      <Stack gap="lg">
        <Group justify="space-between">
          <div>
            <Title order={2}>Store Approvals</Title>
            <Text c="dimmed">Manage and approve new vendor registrations.</Text>
          </div>
          <Button variant="light" onClick={fetchStores}>Refresh List</Button>
        </Group>

        <Paper p="md" withBorder radius="md" pos="relative">
          <LoadingOverlay visible={loading} />
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Store Name</Table.Th>
                <Table.Th>Contact</Table.Th>
                <Table.Th>Date Requested</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th ta="right">Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {stores.length > 0 ? (
                stores.map((store) => (
                  <Table.Tr key={store.id}>
                    <Table.Td>
                      <Text fw={500}>{store.name[locale] || store.name.en}</Text>
                    </Table.Td>
                    <Table.Td>{store.contactPhone}</Table.Td>
                    <Table.Td>{new Date(store.createdAt).toLocaleDateString()}</Table.Td>
                    <Table.Td>
                      <Badge color="orange" variant="light">Pending Approval</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs" justify="flex-end">
                        <ActionIcon 
                          variant="filled" 
                          color="teal" 
                          onClick={() => handleStatusChange(store.id, 'APPROVED')}
                          title="Approve"
                        >
                          <IconCheck size={16} />
                        </ActionIcon>
                        <ActionIcon 
                          variant="filled" 
                          color="red" 
                          onClick={() => handleStatusChange(store.id, 'REJECTED')}
                          title="Reject"
                        >
                          <IconX size={16} />
                        </ActionIcon>
                        <ActionIcon variant="light" color="gray" title="View Details">
                          <IconEye size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={5} ta="center" py="xl">
                    <Text c="dimmed">No pending store requests found.</Text>
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
