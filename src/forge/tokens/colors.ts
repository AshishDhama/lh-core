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
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',
    600: '#9333EA',
    700: '#7E22CE',
    800: '#6B21A8',
    900: '#581C87',
  },

  // Semantic
  success: { light: '#86efac', DEFAULT: '#22c55e', dark: '#15803d' },
  warning: { light: '#fde047', DEFAULT: '#eab308', dark: '#a16207' },
  error: { light: '#fca5a5', DEFAULT: '#ef4444', dark: '#b91c1c' },

  // Subject palette (Brilliant-inspired)
  subject: {
    code: { light: '#EDE9FE', DEFAULT: '#8B5CF6', dark: '#6D28D9' },
    science: { light: '#FEF9C3', DEFAULT: '#FACC15', dark: '#CA8A04' },
    math: { light: '#D1FAE5', DEFAULT: '#10B981', dark: '#059669' },
    logic: { light: '#FFEDD5', DEFAULT: '#F97316', dark: '#EA580C' },
  },

  // Border
  border: '#e2e8f0',
  borderSubtle: '#F0F0F0',
  borderMuted: '#E5E5E5',

  // Surfaces (light mode)
  surface: {
    primary: '#ffffff',
    secondary: '#fafbfc',
    tertiary: '#f1f5f9',
    elevated: '#ffffff',
    warm: '#F9F9FB',
    warmAlt: '#F8F7F4',
    card: '#FFFFFF',
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

  // Gradients (CSS strings referencing CSS vars)
  gradients: {
    premiumDark: 'linear-gradient(135deg, var(--color-subject-code-dark) 0%, var(--color-purple-900) 100%)',
    warmSurface: 'linear-gradient(180deg, var(--color-surface-warm) 0%, var(--color-surface-warm-alt) 100%)',
    subjectCode: 'linear-gradient(135deg, var(--color-subject-code) 0%, var(--color-purple-500) 100%)',
  },
};
