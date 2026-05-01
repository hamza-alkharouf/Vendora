'use client';

import { Paper, Title, Text, Container, Group, Anchor, Center, Box, Stack } from '@mantine/core';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <Box 
      style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--mantine-color-vendora-6) 0%, var(--mantine-color-blue-9) 100%)',
      }}
    >
      <Container size={420} my={40}>
        <Paper withBorder shadow="xl" p={30} radius="lg">
          <Stack gap="xs" mb="xl">
            <Title order={2} ta="center" c="vendora.7">
              {title}
            </Title>
            {subtitle && (
              <Text c="dimmed" size="sm" ta="center">
                {subtitle}
              </Text>
            )}
          </Stack>

          {children}
        </Paper>
        
        <Center mt="md">
          <Text size="xs" c="white" opacity={0.8}>
            © 2026 Vendora Marketplace Platform. All rights reserved.
          </Text>
        </Center>
      </Container>
    </Box>
  );
}
