'use client';

import { useState, useEffect } from 'react';
import { Title, Stack, Paper, Table, Badge, Group, ActionIcon, Button, Text, LoadingOverlay, Avatar } from '@mantine/core';
import { IconDashboard, IconPackage, IconList, IconTruck, IconSettings, IconUsers, IconMessageCircle, IconPlus } from '@tabler/icons-react';
import { DashboardLayout } from '@repo/ui/layouts/dashboard-layout';
import { notifications } from '@mantine/notifications';
import api from '@repo/api';
import { useTranslations } from 'next-intl';

export default function VendorRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const tNav = useTranslations('Navigation');

  const vendorLinks = [
    { label: tNav('overview'), icon: IconDashboard, link: '/' },
    { label: tNav('products'), icon: IconPackage, link: '/products' },
    { label: tNav('orders'), icon: IconList, link: '/orders' },
    { label: 'Requests', icon: IconMessageCircle, link: '/requests', active: true },
    { label: 'Team', icon: IconUsers, link: '/team' },
    { label: tNav('settings'), icon: IconSettings, link: '/settings' },
  ];

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const storeId = localStorage.getItem('storeId');
      const res = await api.get(`/requests/my-store?storeId=${storeId}`);
      setRequests(res.data);
    } catch (e) {
      notifications.show({ title: 'Error', message: 'Failed to fetch your requests', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'orange';
      case 'APPROVED': return 'teal';
      case 'REJECTED': return 'red';
      case 'ESCALATED': return 'grape';
      default: return 'gray';
    }
  };

  return (
    <DashboardLayout 
      user={{ name: 'Mega Store', role: 'Premium Seller' }}
      links={vendorLinks}
    >
      <Stack gap="lg">
        <Group justify="space-between">
          <div>
            <Title order={2}>My Requests</Title>
            <Text c="dimmed">Track status of your catalog changes, registrations, and removal requests.</Text>
          </div>
          <Button leftSection={<IconPlus size={18} />} color="vendora">New Request</Button>
        </Group>

        <Paper p="md" withBorder radius="md" pos="relative">
          <LoadingOverlay visible={loading} />
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Type</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Feedback / Response</Table.Th>
                <Table.Th>Submitted Date</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {requests.map((request) => (
                <Table.Tr key={request.id}>
                  <Table.Td>
                    <Badge variant="outline">{request.type.replace(/_/g, ' ')}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getStatusColor(request.status)} variant="light">
                      {request.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{request.feedback || <Text span c="dimmed" fs="italic">Waiting for review...</Text>}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs">{new Date(request.createdAt).toLocaleDateString()}</Text>
                  </Table.Td>
                </Table.Tr>
              ))}
              {requests.length === 0 && !loading && (
                <Table.Tr>
                  <Table.Td colSpan={4} ta="center" py="xl">
                    <Text c="dimmed">You haven't submitted any requests yet.</Text>
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
