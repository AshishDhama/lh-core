export const motion = {
  duration: {
    instant: '100ms',
    fast: '150ms',
    base: '200ms',
    moderate: '300ms',
    slow: '500ms',
  },

  easing: {
    linear: 'linear',
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  transition: {
    fast: 'all 150ms cubic-bezier(0.16, 1, 0.3, 1)',
    base: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    moderate: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

export type MotionDurationKey = keyof typeof motion.duration;
export type MotionEasingKey = keyof typeof motion.easing;
