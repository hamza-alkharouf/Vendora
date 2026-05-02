'use client';

import { MantineProvider as BaseMantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from './theme';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';

export function MantineProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseMantineProvider theme={theme} defaultColorScheme="auto">
      <Notifications position="top-right" zIndex={1000} />
      {children}
    </BaseMantineProvider>
  );
}
