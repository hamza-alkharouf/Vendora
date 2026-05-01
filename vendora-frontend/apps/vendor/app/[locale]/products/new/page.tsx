'use client';

import { useState } from 'react';
import { Stepper, Button, Group, TextInput, NumberInput, Textarea, Stack, Paper, Title, Text, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import { DashboardLayout } from '@repo/ui/layouts/dashboard-layout';
import { IconPackage, IconList, IconTruck, IconSettings, IconDashboard, IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import api from '@repo/api';
import { useTranslations } from 'next-intl';

const vendorLinks = [
  { label: 'overview', icon: IconDashboard, link: '/' },
  { label: 'products', icon: IconPackage, link: '/products', active: true },
  { label: 'orders', icon: IconList, link: '/orders' },
  { label: 'shipping', icon: IconTruck, link: '/shipping' },
  { label: 'settings', icon: IconSettings, link: '/settings' },
];

export default function NewProductPage() {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const tNav = useTranslations('Navigation');

  const form = useForm({
    initialValues: {
      title: { ar: '', en: '', he: '' },
      description: { ar: '', en: '', he: '' },
      price: 0,
    },
    validate: (values) => {
      if (active === 0) {
        return {
          'title.ar': values.title.ar.length < 3 ? 'Title in Arabic is required' : null,
          'title.en': values.title.en.length < 3 ? 'Title in English is required' : null,
        };
      }
      return {};
    },
  });

  const handleNext = () => setActive((current) => (current < 2 ? current + 1 : current));
  const handlePrev = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      await api.post('/products', values);
      notifications.show({ title: 'Product Created', message: 'Your product has been added successfully.', color: 'teal' });
      window.location.href = '/products';
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to create product.', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout 
      user={{ name: 'Mega Store', role: 'Premium Seller' }} 
      links={vendorLinks.map(l => ({ ...l, label: tNav(l.label as any) }))}
    >
      <Stack gap="xl">
        <Title order={2}>Add New Product</Title>

        <Paper p="xl" withBorder radius="md">
          <Stepper active={active} onStepClick={setActive} color="vendora" breakpoint="sm">
            <Stepper.Step label="Basic Info" description="Localized titles and price">
              <Stack gap="md" mt="xl">
                <TextInput label="Title (العربية)" placeholder="اسم المنتج" required {...form.getInputProps('title.ar')} />
                <TextInput label="Title (English)" placeholder="Product Name" required {...form.getInputProps('title.en')} />
                <TextInput label="Title (עברית)" placeholder="שם המוצר" {...form.getInputProps('title.he')} />
                <NumberInput label="Price ($)" placeholder="99.99" min={0} required {...form.getInputProps('price')} />
              </Stack>
            </Stepper.Step>

            <Stepper.Step label="Description" description="Tell your customers more">
              <Stack gap="md" mt="xl">
                <Textarea label="Description (العربية)" placeholder="وصف المنتج..." minRows={3} {...form.getInputProps('description.ar')} />
                <Textarea label="Description (English)" placeholder="Product description..." minRows={3} {...form.getInputProps('description.en')} />
                <Textarea label="Description (עברית)" placeholder="תיאור המוצר..." minRows={3} {...form.getInputProps('description.he')} />
              </Stack>
            </Stepper.Step>

            <Stepper.Step label="Review" description="Confirm details">
               <Stack gap="md" mt="xl">
                  <Text fw={700}>Review your product details before submitting.</Text>
                  <Box p="md" bg="gray.0" radius="md">
                    <Text size="sm"><b>Title (AR):</b> {form.values.title.ar}</Text>
                    <Text size="sm"><b>Title (EN):</b> {form.values.title.en}</Text>
                    <Text size="sm"><b>Price:</b> ${form.values.price}</Text>
                  </Box>
               </Stack>
            </Stepper.Step>
            
            <Stepper.Completed>
              <Stack align="center" gap="xs" py="xl">
                <IconCheck size={40} color="var(--mantine-color-teal-6)" />
                <Text fw={700}>All set!</Text>
                <Text size="sm" c="dimmed">Click submit to list your product on the marketplace.</Text>
              </Stack>
            </Stepper.Completed>
          </Stepper>

          <Group justify="right" mt="xl">
            {active !== 0 && (
              <Button variant="default" onClick={handlePrev}>Back</Button>
            )}
            {active < 2 ? (
              <Button color="vendora" onClick={handleNext}>Next Step</Button>
            ) : (
              <Button color="teal" loading={loading} onClick={() => handleSubmit(form.values)}>Submit Product</Button>
            )}
          </Group>
        </Paper>
      </Stack>
    </DashboardLayout>
  );
}
