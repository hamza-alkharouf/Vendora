'use client';

import { useState, useEffect } from 'react';
import { Title, Stack, Paper, Table, Badge, Group, ActionIcon, Button, Text, LoadingOverlay, Drawer, Timeline } from '@mantine/core';
import { IconDots, IconEye, IconCheck, IconX, IconClock, IconSearch } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import api from '@repo/api';

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/requests/admin/all');
      setRequests(res.data);
    } catch (err) {
      notifications.show({ title: 'Error', message: 'Failed to fetch requests', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.put(`/requests/admin/${id}/status`, { status });
      notifications.show({ title: 'Success', message: `Request ${status.toLowerCase()} successfully`, color: 'teal' });
      fetchRequests();
      setDrawerOpen(false);
    } catch (err) {
      notifications.show({ title: 'Error', message: 'Failed to update request', color: 'red' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'orange';
      case 'APPROVED': return 'teal';
      case 'REJECTED': return 'red';
      case 'ESCALATED': return 'grape';
      default: return 'blue';
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>Marketplace Request Management</Title>
          <Text c="dimmed">Review, approve, and resolve user-submitted requests.</Text>
        </div>
        <Button variant="light" onClick={fetchRequests}>Refresh Queue</Button>
      </Group>

      <Paper p="md" withBorder radius="md" pos="relative">
        <LoadingOverlay visible={loading} />
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Type</Table.Th>
              <Table.Th>Submitter</Table.Th>
              <Table.Th>Priority</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th ta="right">Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {requests.map((req) => (
              <Table.Tr key={req.id}>
                <Table.Td><Badge variant="light">{req.type.replace('_', ' ')}</Badge></Table.Td>
                <Table.Td>
                  <Text size="sm" fw={500}>{req.submitter.name || req.submitter.phone}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge color={req.priority > 5 ? 'red' : 'blue'} variant="dot">
                    {req.priority > 5 ? 'High' : 'Normal'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge color={getStatusColor(req.status)}>{req.status}</Badge>
                </Table.Td>
                <Table.Td><Text size="xs">{new Date(req.createdAt).toLocaleDateString()}</Text></Table.Td>
                <Table.Td ta="right">
                  <ActionIcon variant="light" onClick={() => { setSelectedRequest(req); setDrawerOpen(true); }}>
                    <IconEye size={16} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Request Review"
        position="right"
        size="md"
      >
        {selectedRequest && (
          <Stack>
            <Paper p="sm" withBorder>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">Request Data</Text>
              <pre style={{ fontSize: 10, overflow: 'auto' }}>
                {JSON.stringify(selectedRequest.data, null, 2)}
              </pre>
            </Paper>

            <Group grow mt="xl">
              <Button color="teal" leftSection={<IconCheck size={16} />} onClick={() => handleStatusUpdate(selectedRequest.id, 'APPROVED')}>
                Approve
              </Button>
              <Button color="red" leftSection={<IconX size={16} />} onClick={() => handleStatusUpdate(selectedRequest.id, 'REJECTED')}>
                Reject
              </Button>
            </Group>
          </Stack>
        )}
      </Drawer>
    </Stack>
  );
}
