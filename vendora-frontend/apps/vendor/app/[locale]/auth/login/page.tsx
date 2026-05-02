'use client';

import { useState } from 'react';
import { TextInput, Button, PinInput, Stack, Text, Group, ActionIcon, Anchor } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPhone, IconArrowLeft } from '@tabler/icons-react';
import { AuthLayout } from '@repo/ui/layouts/auth-layout';
import { notifications } from '@mantine/notifications';
import { auth } from '@repo/api';
import { useAuth } from '@repo/ui';
import { useRouter, useParams } from 'next/navigation';

export default function VendorLoginPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const phoneForm = useForm({
    initialValues: { phone: '' },
    validate: {
      phone: (value) => (value.length < 10 ? 'Invalid phone number' : null),
    },
  });

  const handleRequestOtp = async (values: typeof phoneForm.values) => {
    setLoading(true);
    try {
      await auth.requestOtp(values.phone);
      setStep('otp');
      notifications.show({
        title: 'OTP Sent',
        message: `A verification code has been sent to ${values.phone}`,
        color: 'teal',
      });
    } catch (err) {
      notifications.show({ title: 'Error', message: 'Failed to send OTP', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    if (otp.length !== 4) return;
    setLoading(true);
    try {
      await login(phoneForm.values.phone, otp);
      notifications.show({ title: 'Success', message: 'Welcome back!', color: 'teal' });
      router.push(`/${locale}`);
    } catch (err) {
      notifications.show({ title: 'Error', message: 'Invalid code', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Vendor Login" 
      subtitle={step === 'phone' ? 'Access your seller dashboard' : 'Enter the code to verify your store access'}
    >
      {step === 'phone' ? (
        <form onSubmit={phoneForm.onSubmit(handleRequestOtp)}>
          <Stack>
            <TextInput
              label="Phone Number"
              placeholder="05x-xxxxxxx"
              leftSection={<IconPhone size={16} />}
              {...phoneForm.getInputProps('phone')}
              size="md"
            />
            <Button type="submit" loading={loading} size="md" fullWidth color="vendora">
              Login to Seller Central
            </Button>
            <Text size="xs" ta="center" c="dimmed">
              New to Vendora? <Anchor size="xs" fw={700}>Register your store</Anchor>
            </Text>
          </Stack>
        </form>
      ) : (
        <Stack align="center">
          <PinInput 
            size="xl" 
            length={4} 
            oneTimeCode 
            autoFocus 
            disabled={loading}
            onComplete={handleVerifyOtp}
            type="number"
          />
          <Group justify="center">
            <ActionIcon variant="subtle" onClick={() => setStep('phone')} disabled={loading}>
              <IconArrowLeft size={16} />
            </ActionIcon>
            <Text size="sm" c="dimmed">Didn't receive a code? <Anchor size="sm">Resend</Anchor></Text>
          </Group>
          <Button 
             variant="light" 
             fullWidth 
             loading={loading} 
             onClick={() => handleVerifyOtp('1234')}
          >
            Verify & Continue
          </Button>
        </Stack>
      )}
    </AuthLayout>
  );
}
