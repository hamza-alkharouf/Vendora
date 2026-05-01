# Skill: Mantine UI Conformance & i18n

## Description
Enforces the strict use of Mantine UI components and internationalization (i18n) standards for the Next.js frontends (Admin, Vendor, Storefront).

## Rules
1. **Mantine ONLY**:
   - Do NOT use MUI, Chakra, Ant Design, or Tailwind UI components.
   - Build all forms using `@mantine/form`.
   - Build tables, modals, and drawers using Mantine core components.
2. **Tailwind as a Helper**:
   - Tailwind CSS is allowed ONLY for layout utilities (e.g., `flex`, `grid`, margins, paddings) when Mantine's `<Group>`, `<Stack>`, or `<Flex>` are overkill or insufficient.
   - Do NOT use Tailwind for colors or theming. Rely on Mantine's CSS variables and `createTheme`.
3. **RTL & Logical CSS**:
   - The app must support English (LTR), Arabic (RTL), and Hebrew (RTL).
   - Never use physical CSS properties like `margin-left` or `padding-right`.
   - ALWAYS use logical properties: `margin-inline-start`, `padding-block`, `border-inline-end`.
4. **No Hardcoded Strings**:
   - Every piece of text must use translation keys from `/locales/`.
5. **Accessibility (WCAG 2.1 AA)**:
   - Use semantic HTML. Ensure all inputs have labels.
   - Maintain color contrast ratios.

6. **Mandatory Lint Conformance**:
   - The use of `any` is strictly forbidden. The shared ESLint config `base.js` is set to `error` for `@typescript-eslint/no-explicit-any`.
   - All frontend apps must pass `pnpm lint` before completion. AI must fix all lint errors before finalizing UI components.
