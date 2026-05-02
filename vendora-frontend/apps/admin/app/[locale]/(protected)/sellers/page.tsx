'use client';

import { useState, useEffect } from 'react';
import { Title, Stack, Paper, Table, Badge, Group, ActionIcon, Button, Text, LoadingOverlay, Menu, Avatar, Progress, Tooltip, rem } from '@mantine/core';
import { IconDots, IconCheck, IconX, IconAlertCircle, IconUserPlus, IconExternalLink } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import api from '@repo/api';

interface Seller {
  id: string;
  name: string;
  handle: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  contactPhone: string;
  createdAt: string;
  onboarding?: {
    storeInformation: boolean;
    stripeConnection: boolean;
    locationsShipping: boolean;
    products: boolean;
  };
}

export default function SellerManagementPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchSellers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/stores'); 
      setSellers(response.data);
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to fetch sellers.', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSellers(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.put(`/seller/${id}/status`, { status });
      notifications.show({ title: 'Success', message: `Seller status updated to ${status}.`, color: 'teal' });
      fetchSellers();
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to update status.', color: 'red' });
    }
  };

  const getOnboardingProgress = (onboarding?: Seller['onboarding']) => {
    if (!onboarding) return 0;
    const steps = [
      onboarding.storeInformation,
      onboarding.stripeConnection,
      onboarding.locationsShipping,
      onboarding.products,
    ];
    const completed = steps.filter(Boolean).length;
    return (completed / steps.length) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'teal';
      case 'SUSPENDED': return 'red';
      case 'INACTIVE': return 'gray';
      default: return 'blue';
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>Seller & Vendor Management</Title>
          <Text c="dimmed">Onboard, manage, and empower marketplace sellers.</Text>
        </div>
        <Group>
          <Button variant="light" onClick={fetchSellers}>Refresh</Button>
          <Button leftSection={<IconUserPlus size={18} />}>Add New Seller</Button>
        </Group>
      </Group>

      <Paper p="md" withBorder radius="md" pos="relative">
        <LoadingOverlay visible={loading} />
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Seller / Business</Table.Th>
              <Table.Th>Onboarding</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Created At</Table.Th>
              <Table.Th ta="right">Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sellers.length > 0 ? (
              sellers.map((seller) => (
                <Table.Tr key={seller.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar color="blue" radius="xl">
                        {seller.name.substring(0, 2).toUpperCase()}
                      </Avatar>
                      <div>
                        <Text size="sm" fw={500}>{seller.name}</Text>
                        <Text size="xs" c="dimmed">@{seller.handle}</Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td style={{ width: rem(200) }}>
                    <Tooltip label={`${getOnboardingProgress(seller.onboarding)}% Complete`}>
                      <Stack gap={4}>
                        <Progress 
                          value={getOnboardingProgress(seller.onboarding)} 
                          size="sm" 
                          color={getOnboardingProgress(seller.onboarding) === 100 ? 'teal' : 'blue'}
                          striped 
                          animated={getOnboardingProgress(seller.onboarding) < 100}
                        />
                        <Text size="xs" ta="center">
                          {getOnboardingProgress(seller.onboarding)}%
                        </Text>
                      </Stack>
                    </Tooltip>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getStatusColor(seller.status)} variant="light">
                      {seller.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{new Date(seller.createdAt).toLocaleDateString()}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs" justify="flex-end">
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon variant="light" color="gray">
                            <IconDots size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Label>Manage Status</Menu.Label>
                          <Menu.Item 
                            leftSection={<IconCheck size={14} style={{ color: 'var(--mantine-color-teal-6)' }} />}
                            onClick={() => handleStatusChange(seller.id, 'ACTIVE')}
                          >
                            Activate Store
                          </Menu.Item>
                          <Menu.Item 
                            leftSection={<IconAlertCircle size={14} style={{ color: 'var(--mantine-color-gray-6)' }} />}
                            onClick={() => handleStatusChange(seller.id, 'INACTIVE')}
                          >
                            Set Inactive
                          </Menu.Item>
                          <Menu.Item 
                            leftSection={<IconX size={14} style={{ color: 'var(--mantine-color-red-6)' }} />}
                            onClick={() => handleStatusChange(seller.id, 'SUSPENDED')}
                            color="red"
                          >
                            Suspend Store
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Label>Danger Zone</Menu.Label>
                          <Menu.Item 
                            leftSection={<IconExternalLink size={14} />}
                            onClick={() => window.open(`/seller-dashboard/${seller.id}`, '_blank')}
                          >
                            Impersonate Seller
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5} ta="center" py="xl">
                  <Text c="dimmed">No sellers found.</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
}
