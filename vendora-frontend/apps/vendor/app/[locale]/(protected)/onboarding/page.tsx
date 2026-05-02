'use client';

import { useState } from 'react';
import { Stepper, Button, Group, TextInput, Textarea, Title, Text, Paper, Stack, SimpleGrid, rem } from '@mantine/core';
import { IconBuildingStore, IconCreditCard, IconTruck, IconPackage, IconCheck, IconDashboard, IconList, IconSettings } from '@tabler/icons-react';
import { DashboardLayout } from '@repo/ui/layouts/dashboard-layout';
import { notifications } from '@mantine/notifications';
import api from '@repo/api';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    description: '',
    businessAddress: '',
    taxId: '',
  });

  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleComplete = async () => {
    setLoading(true);
    try {
      const storeId = localStorage.getItem('storeId');
      await api.put(`/seller/${storeId}/onboarding`, {
        storeInformation: true,
        stripeConnection: true, // Mocked
        locationsShipping: true, // Mocked
        products: true, // Mocked
      });
      notifications.show({
        title: 'Onboarding Complete!',
        message: 'Your store is now ready for review.',
        color: 'teal',
      });
      router.push('/');
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to save progress.', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout 
      user={{ name: 'New Seller', role: 'Onboarding' }}
      links={[
        { label: 'Onboarding', icon: IconDashboard, link: '/onboarding', active: true },
      ]}
    >
      <Stack gap="xl" maw={800} mx="auto" py="xl">
        <header>
          <Title order={1}>Seller Onboarding</Title>
          <Text c="dimmed">Complete these steps to start selling on Vendora.</Text>
        </header>

        <Paper p="xl" withBorder radius="md">
          <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false} color="vendora">
            <Stepper.Step 
              label="Store Info" 
              description="Basic details" 
              icon={<IconBuildingStore size={18} />}
            >
              <Stack gap="md" mt="xl">
                <TextInput 
                  label="Store Name" 
                  placeholder="My Awesome Store" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <TextInput 
                  label="Unique Handle" 
                  placeholder="my-store" 
                  required 
                  description="Used in your store URL"
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                />
                <Textarea 
                  label="Description" 
                  placeholder="Tell us about your business..." 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Stack>
            </Stepper.Step>

            <Stepper.Step 
              label="Payouts" 
              description="Stripe Connect" 
              icon={<IconCreditCard size={18} />}
            >
              <Stack align="center" gap="md" mt="xl" py="xl">
                <IconCreditCard size={64} color="var(--mantine-color-blue-6)" />
                <Title order={3}>Connect with Stripe</Title>
                <Text ta="center" maw={500}>
                  Vendora uses Stripe Connect to ensure secure and fast payouts to our vendors. 
                  Click the button below to set up your payout account.
                </Text>
                <Button color="blue" size="md">Connect Stripe Account</Button>
                <Text size="xs" c="dimmed">You will be redirected to Stripe to complete this process.</Text>
              </Stack>
            </Stepper.Step>

            <Stepper.Step 
              label="Shipping" 
              description="Zones & Rates" 
              icon={<IconTruck size={18} />}
            >
              <Stack gap="md" mt="xl">
                <TextInput 
                  label="Business Address" 
                  placeholder="123 Market St, City, Country" 
                  required 
                  value={formData.businessAddress}
                  onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                />
                <TextInput 
                  label="Tax ID / VAT Number" 
                  placeholder="Optional" 
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                />
                <Paper p="md" withBorder bg="gray.0">
                  <Group justify="space-between">
                    <div>
                      <Text fw={500}>Default Shipping Zone</Text>
                      <Text size="xs" c="dimmed">Automatically configured based on your address.</Text>
                    </div>
                    <Button variant="outline" size="xs">Configure Rates</Button>
                  </Group>
                </Paper>
              </Stack>
            </Stepper.Step>

            <Stepper.Completed>
              <Stack align="center" gap="md" mt="xl" py="xl">
                <IconCheck size={64} color="var(--mantine-color-teal-6)" />
                <Title order={3}>Ready to Go!</Title>
                <Text ta="center" maw={500}>
                  You've completed the essential onboarding steps. Once you submit, our team will review 
                  your application and activate your store.
                </Text>
              </Stack>
            </Stepper.Completed>
          </Stepper>

          <Group justify="flex-end" mt="xl">
            {active !== 0 && active <= 3 && (
              <Button variant="default" onClick={prevStep}>
                Back
              </Button>
            )}
            {active < 3 ? (
              <Button onClick={nextStep} color="vendora">Next step</Button>
            ) : (
              <Button onClick={handleComplete} color="teal" loading={loading}>Complete Onboarding</Button>
            )}
          </Group>
        </Paper>
      </Stack>
    </DashboardLayout>
  );
}
