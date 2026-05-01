'use client';

import { Menu, Button, UnstyledButton, Group, Text, rem } from '@mantine/core';
import { IconLanguage, IconChevronDown } from '@tabler/icons-react';
import { useRouter, usePathname } from 'next/navigation';

const languages = [
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'he', label: 'עברית', flag: '🇮🇱' },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (lang: string) => {
    const newPathname = pathname.replace(/^\/(ar|en|he)/, `/${lang}`);
    router.push(newPathname);
  };

  const currentLang = languages.find((l) => pathname.startsWith(`/${l.code}`)) || languages[0];

  return (
    <Menu shadow="md" width={150}>
      <Menu.Target>
        <UnstyledButton>
          <Group gap="xs">
            <IconLanguage size={20} stroke={1.5} />
            <Text size="sm" fw={500} visibleFrom="xs">{currentLang?.label}</Text>
            <IconChevronDown size={14} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        {languages.map((lang) => (
          <Menu.Item 
            key={lang.code} 
            leftSection={<Text size="sm">{lang.flag}</Text>}
            onClick={() => handleLanguageChange(lang.code)}
          >
            {lang.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
