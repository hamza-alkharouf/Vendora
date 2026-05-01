import { AppShell, Burger, Group, NavLink, Title, Text, Avatar, Menu, UnstyledButton, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDashboard, IconBuildingStore, IconSettings, IconUsers, IconLogout, IconChevronRight } from '@tabler/icons-react';
import { LanguageSwitcher } from '../components/language-switcher';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: { name: string; role: string; avatar?: string };
  links: { label: string; icon: any; link: string; active?: boolean }[];
}

export function DashboardLayout({ children, user, links }: DashboardLayoutProps) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={3} c="vendora.6">Vendora</Title>
          </Group>
          
          <Group gap="lg">
            <LanguageSwitcher />
            <Menu shadow="md" width={200}>
            <Menu.Target>
              <UnstyledButton>
                <Group gap="xs">
                  <Avatar src={user.avatar} radius="xl" color="vendora" />
                  <div style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>{user.name}</Text>
                    <Text size="xs" c="dimmed">{user.role}</Text>
                  </div>
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}>
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {links.map((item) => (
          <NavLink
            key={item.label}
            href={item.link}
            label={item.label}
            leftSection={<item.icon size="1.2rem" stroke={1.5} />}
            active={item.active}
            variant="filled"
            color="vendora"
            rightSection={<IconChevronRight size="0.8rem" stroke={1.5} className="mantine-rotate-rtl" />}
            styles={{
              label: { fontSize: '0.95rem', fontWeight: 500 },
            }}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main bg="gray.0">
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
