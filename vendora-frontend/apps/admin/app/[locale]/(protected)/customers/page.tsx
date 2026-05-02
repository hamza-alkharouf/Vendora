'use client';

import { useState, useEffect } from 'react';
import { Title, Stack, Paper, Table, Badge, Group, ActionIcon, Button, Text, LoadingOverlay, Tabs, Avatar } from '@mantine/core';
import { IconDots, IconPlus, IconMail, IconPhone, IconUsers, IconBuildingCommunity } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import api from '@repo/api';

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState<string | null>('customers');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const fetchData = async (tab: string) => {
    setLoading(true);
    try {
      const endpoint = tab === 'customers' ? '/customer/admin/list' : 
                       tab === 'groups' ? '/customer/admin/groups' : 
                       '/customer/admin/organizations';
      const res = await api.get(endpoint);
      setData(res.data);
    } catch (err) {
      notifications.show({ title: 'Error', message: 'Failed to fetch data', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab) fetchData(activeTab);
  }, [activeTab]);

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>Customer & Account Management</Title>
          <Text c="dimmed">Manage customer profiles, groups, and B2B organizations.</Text>
        </div>
        <Button leftSection={<IconPlus size={18} />}>Add New</Button>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab} variant="outline">
        <Tabs.List>
          <Tabs.Tab value="customers" leftSection={<IconUsers size={16} />}>All Customers</Tabs.Tab>
          <Tabs.Tab value="groups" leftSection={<IconUsers size={16} />}>Customer Groups</Tabs.Tab>
          <Tabs.Tab value="organizations" leftSection={<IconBuildingCommunity size={16} />}>B2B Organizations</Tabs.Tab>
        </Tabs.List>

        <Paper p="md" mt="md" withBorder radius="md" pos="relative">
          <LoadingOverlay visible={loading} />
          
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name / Details</Table.Th>
                <Table.Th>Type / Info</Table.Th>
                <Table.Th>Created At</Table.Th>
                <Table.Th ta="right">Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.map((item) => (
                <Table.Tr key={item.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar color="blue" radius="xl">
                        {item.name?.substring(0, 2).toUpperCase()}
                      </Avatar>
                      <div>
                        <Text size="sm" fw={500}>{item.name || `${item.firstName} ${item.lastName}`}</Text>
                        <Text size="xs" c="dimmed">{item.email || item.phone}</Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    {activeTab === 'customers' && (
                      <Group gap={4}>
                        {item.groups?.map((g: any) => (
                          <Badge key={g.id} size="xs" variant="light">{g.name}</Badge>
                        ))}
                      </Group>
                    )}
                    {activeTab !== 'customers' && (
                      <Text size="sm">{item._count?.users || item._count?.members || 0} Members</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{new Date(item.createdAt).toLocaleDateString()}</Text>
                  </Table.Td>
                  <Table.Td ta="right">
                    <ActionIcon variant="light" color="gray">
                      <IconDots size={16} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      </Tabs>
    </Stack>
  );
}
