'use client';

import { useState, useEffect } from 'react';
import { Title, Stack, Paper, Table, Badge, Group, ActionIcon, Button, Text, LoadingOverlay, Avatar, Modal, TextInput, Select, rem } from '@mantine/core';
import { IconUserPlus, IconTrash, IconMail, IconDashboard, IconPackage, IconList, IconTruck, IconSettings, IconUsers } from '@tabler/icons-react';
import { DashboardLayout } from '@repo/ui/layouts/dashboard-layout';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import api from '@repo/api';
import { useTranslations } from 'next-intl';

export default function TeamManagementPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const [inviteData, setInviteData] = useState({ email: '', role: 'MEMBER' });
  const tNav = useTranslations('Navigation');

  const vendorLinks = [
    { label: tNav('overview'), icon: IconDashboard, link: '/' },
    { label: tNav('products'), icon: IconPackage, link: '/products' },
    { label: tNav('orders'), icon: IconList, link: '/orders' },
    { label: 'Team', icon: IconUsers, link: '/team', active: true },
    { label: tNav('settings'), icon: IconSettings, link: '/settings' },
  ];

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const storeId = localStorage.getItem('storeId');
      const response = await api.get(`/seller/${storeId}`);
      setMembers(response.data.members || []);
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to fetch team members.', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleInvite = async () => {
    try {
      const storeId = localStorage.getItem('storeId');
      await api.post(`/seller/${storeId}/invites`, inviteData);
      notifications.show({ title: 'Invite Sent', message: `Invitation sent to ${inviteData.email}`, color: 'teal' });
      close();
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to send invitation.', color: 'red' });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'OWNER': return 'red';
      case 'ADMIN': return 'blue';
      case 'MEMBER': return 'gray';
      default: return 'blue';
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
            <Title order={2}>Team Management</Title>
            <Text c="dimmed">Manage your store team and their access levels.</Text>
          </div>
          <Button leftSection={<IconUserPlus size={18} />} color="vendora" onClick={open}>
            Invite Member
          </Button>
        </Group>

        <Paper p="md" withBorder radius="md" pos="relative">
          <LoadingOverlay visible={loading} />
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Member</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Contact</Table.Th>
                <Table.Th ta="right">Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {members.length > 0 ? (
                members.map((member) => (
                  <Table.Tr key={member.id}>
                    <Table.Td>
                      <Group gap="sm">
                        <Avatar color="vendora" radius="xl">
                          {member.user.name?.substring(0, 2).toUpperCase() || 'U'}
                        </Avatar>
                        <div>
                          <Text size="sm" fw={500}>{member.user.name || 'Unnamed User'}</Text>
                          <Text size="xs" c="dimmed">{member.user.id === member.store.ownerId ? 'Primary Owner' : 'Team Member'}</Text>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getRoleColor(member.role)} variant="light">
                        {member.role}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{member.user.phone}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs" justify="flex-end">
                        {member.role !== 'OWNER' && (
                          <ActionIcon variant="light" color="red">
                            <IconTrash size={16} />
                          </ActionIcon>
                        )}
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={4} ta="center" py="xl">
                    <Text c="dimmed">No team members found.</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Paper>
      </Stack>

      <Modal opened={opened} onClose={close} title="Invite Team Member" centered>
        <Stack gap="md">
          <TextInput 
            label="Email Address" 
            placeholder="colleague@example.com" 
            required
            value={inviteData.email}
            onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
          />
          <Select 
            label="Role"
            placeholder="Select a role"
            data={[
              { value: 'ADMIN', label: 'Admin - Operational management' },
              { value: 'MEMBER', label: 'Member - Limited access' },
            ]}
            required
            value={inviteData.role}
            onChange={(val) => setInviteData({ ...inviteData, role: val || 'MEMBER' })}
          />
          <Button fullWidth color="vendora" mt="md" onClick={handleInvite} leftSection={<IconMail size={18} />}>
            Send Invitation
          </Button>
        </Stack>
      </Modal>
    </DashboardLayout>
  );
}
