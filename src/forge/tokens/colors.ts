export const colors = {
  // Brand
  navy: {
    DEFAULT: '#002C77',
    50: '#EEF6FA',
    100: '#D0E2F2',
    200: '#A3C5E5',
    300: '#6A9FD4',
    400: '#3575BC',
    500: '#002C77',
    600: '#002361',
    700: '#001A4A',
    800: '#001234',
    900: '#000A1E',
  },
  teal: {
    DEFAULT: '#008575',
    50: '#E6F7F5',
    100: '#B3E8E2',
    200: '#80D9CF',
    300: '#4DCABC',
    400: '#26BBA9',
    500: '#008575',
    600: '#006B5E',
    700: '#005147',
    800: '#003730',
    900: '#001D19',
  },
  purple: {
    DEFAULT: '#7B61FF',
  },

  // Semantic
  success: { light: '#86efac', DEFAULT: '#22c55e', dark: '#15803d' },
  warning: { light: '#fde047', DEFAULT: '#eab308', dark: '#a16207' },
  error: { light: '#fca5a5', DEFAULT: '#ef4444', dark: '#b91c1c' },

  // Border
  border: '#e2e8f0',

  // Surfaces (light mode)
  surface: {
    primary: '#ffffff',
    secondary: '#fafbfc',
    tertiary: '#f1f5f9',
    elevated: '#ffffff',
  },

  // Surfaces (dark mode)
  surfaceDark: {
    primary: '#0f172a',
    secondary: '#1e293b',
    tertiary: '#334155',
    elevated: '#1e293b',
  },

  // Content (light mode)
  content: {
    primary: '#0f172a',
    secondary: '#475569',
    // #64748b gives 4.76:1 on white — meets WCAG AA (was #94a3b8 at 2.56:1)
    tertiary: '#64748b',
    inverse: '#ffffff',
  },

  // Content (dark mode)
  contentDark: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    tertiary: '#64748b',
    inverse: '#0f172a',
  },
};
