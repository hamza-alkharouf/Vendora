'use client';

import { useState, useEffect } from 'react';
import { Title, Stack, Paper, NumberInput, MultiSelect, Button, Group, Tabs, Text, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { DashboardLayout } from '@repo/ui/layouts/dashboard-layout';
import { IconDeviceFloppy, IconAd, IconCalendarEvent, IconDashboard, IconBuildingStore, IconUsers, IconSettings } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import api from '@repo/api';
import { useTranslations } from 'next-intl';

const daysOptions = [
  { value: '0', label: 'Sunday' },
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
];

const adminLinks = [
  { label: 'Dashboard', icon: IconDashboard, link: '/' },
  { label: 'Stores', icon: IconBuildingStore, link: '/stores' },
  { label: 'Users', icon: IconUsers, link: '/users' },
  { label: 'Settings', icon: IconSettings, link: '/settings', active: true },
];

export default function AdsSettingsPage() {
  const [loading, setLoading] = useState(false);
  const tNav = useTranslations('Navigation');

  const form = useForm({
    initialValues: {
      tier: 'PREMIUM',
      basePrice: 50,
      peakMultiplier: 1.5,
      peakDays: ['5', '6'],
    },
  });

  const handleSave = async (values: typeof form.values) => {
    setLoading(true);
    try {
      await api.post('/ads/config', {
        ...values,
        peakDays: values.peakDays.map(Number),
      });
      notifications.show({
        title: 'Settings Saved',
        message: 'Advertisement pricing has been updated successfully.',
        color: 'teal',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update settings.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout 
      user={{ name: 'Admin', role: 'Super Admin' }} 
      links={adminLinks.map(l => ({ ...l, label: tNav(l.label.toLowerCase() as any) }))}
    >
      <Stack gap="lg">
        <Title order={2}>Global Ads Settings</Title>
        <Text c="dimmed">Configure the pricing logic for marketplace advertisements.</Text>

        <Paper p="xl" withBorder radius="md" pos="relative">
          <LoadingOverlay visible={loading} />
          
          <form onSubmit={form.onSubmit(handleSave)}>
            <Stack gap="md">
              <Group grow>
                <Tabs defaultValue="PREMIUM" onChange={(val) => form.setFieldValue('tier', val as any)}>
                  <Tabs.List mb="lg">
                    <Tabs.Tab value="PREMIUM" leftSection={<IconAd size={16} />}>Premium Tier</Tabs.Tab>
                    <Tabs.Tab value="STANDARD" leftSection={<IconAd size={16} />}>Standard Tier</Tabs.Tab>
                  </Tabs.List>
                </Tabs>
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <NumberInput
                  label="Base Price ($)"
                  description="Initial price for the selected tier"
                  {...form.getInputProps('basePrice')}
                  min={0}
                />
                <NumberInput
                  label="Peak Multiplier"
                  description="Multiplier applied during peak days/events"
                  {...form.getInputProps('peakMultiplier')}
                  min={1}
                  step={0.1}
                  precision={1}
                />
              </SimpleGrid>

              <MultiSelect
                label="Peak Days (Recurring)"
                description="Select days of the week where the multiplier should apply"
                data={daysOptions}
                {...form.getInputProps('peakDays')}
                searchable
              />

              <Group justify="flex-end" mt="xl">
                <Button 
                  type="submit" 
                  leftSection={<IconDeviceFloppy size={18} />} 
                  color="vendora"
                  loading={loading}
                >
                  Save Configuration
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </DashboardLayout>
  );
}

import { SimpleGrid } from '@mantine/core';
