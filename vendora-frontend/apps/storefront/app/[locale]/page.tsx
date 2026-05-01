'use client';

import { Container, Title, Text, Button, Group, Stack, SimpleGrid, Paper, Image, Badge, TextInput } from '@mantine/core';
import { IconSearch, IconShoppingCart } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export default function StorefrontHome() {
  const t = useTranslations('Home');

  return (
    <Stack gap={0}>
      {/* Hero Section */}
      <Box 
        bg="vendora.0" 
        py={80} 
        style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}
      >
        <Container size="lg">
          <Grid align="center">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Stack gap="xl">
                <Badge size="lg" variant="filled" color="vendora" radius="sm">NEW COLLECTION</Badge>
                <Title size={rem(48)} fw={900} style={{ lineHeight: 1.1 }}>
                  {t('welcome')}
                </Title>
                <Text size="xl" c="dimmed" maw={500}>
                  {t('subtitle')}
                </Text>
                
                <Paper withBorder p="xs" radius="md" shadow="sm" maw={600}>
                  <Group gap="xs">
                    <TextInput 
                      placeholder={t('search')}
                      leftSection={<IconSearch size={18} />}
                      style={{ flex: 1 }}
                      variant="unstyled"
                    />
                    <Button color="vendora" radius="md">Search</Button>
                  </Group>
                </Paper>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 5 }} visibleFrom="md">
               <Image 
                 src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80" 
                 radius="lg" 
                 alt="Hero Image"
                 shadow="xl"
               />
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* Featured Products */}
      <Container size="lg" py={80}>
        <Group justify="space-between" mb="xl">
          <Title order={2}>{t('featuredProducts')}</Title>
          <Button variant="subtle" color="vendora">View All</Button>
        </Group>

        <SimpleGrid cols={{ base: 2, sm: 3, lg: 4 }} spacing="lg">
           {[1, 2, 3, 4].map((i) => (
             <Paper key={i} withBorder radius="md" p="md" className="hover-lift">
               <Image 
                 src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80`} 
                 radius="md" 
                 h={200}
                 alt="Product"
               />
               <Stack gap="xs" mt="md">
                 <Text fw={700} size="lg">Premium Product {i}</Text>
                 <Text size="sm" c="dimmed" lineClamp={1}>High quality localized description here.</Text>
                 <Group justify="space-between" mt="xs">
                    <Text fw={900} size="xl" c="vendora.7">$99.00</Text>
                    <Button variant="light" color="vendora" radius="xl" size="xs">
                      <IconShoppingCart size={16} />
                    </Button>
                 </Group>
               </Stack>
             </Paper>
           ))}
        </SimpleGrid>
      </Container>
    </Stack>
  );
}

import { Box, Grid, rem } from '@mantine/core';
