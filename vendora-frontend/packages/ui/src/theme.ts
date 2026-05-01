import { createTheme, MantineColorsTuple } from '@mantine/core';

const primaryColor: MantineColorsTuple = [
  '#e0fbff',
  '#cbf2ff',
  '#9ae2ff',
  '#64d2ff',
  '#3cc5fe',
  '#23bcfe',
  '#09b8ff',
  '#00a1e4',
  '#008fcd',
  '#007cb5',
];

export const theme = createTheme({
  primaryColor: 'vendora',
  colors: {
    vendora: primaryColor,
  },
  fontFamily: 'Inter, Cairo, sans-serif',
  headings: {
    fontFamily: 'Outfit, Cairo, sans-serif',
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'lg',
        withBorder: true,
      },
    },
  },
});
