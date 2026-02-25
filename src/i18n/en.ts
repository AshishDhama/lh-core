export const en = {
  // Navigation
  nav: {
    dashboard: 'Dashboard',
    programs: 'Programs',
    development: 'Development',
    scheduling: 'Scheduling',
    insights: 'Insights',
    discovery: 'Discovery',
    collapse: 'Collapse',
  },

  // Common actions
  actions: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    retry: 'Retry',
    continue: 'Continue',
    back: 'Back',
    next: 'Next',
    close: 'Close',
    search: 'Search',
    filter: 'Filter',
    send: 'Send',
    submit: 'Submit',
    confirm: 'Confirm',
    bookSlot: 'Book Slot',
    addGoal: 'Add Goal',
    addFirstGoal: 'Add First Goal',
    retryFailedChecks: 'Retry Failed Checks',
    continueToAssessment: 'Continue to Assessment',
  },

  // Status labels
  status: {
    active: 'Active',
    inactive: 'Inactive',
    completed: 'Completed',
    inProgress: 'In Progress',
    pending: 'Pending',
    locked: 'Locked',
    available: 'Available',
    full: 'Full',
    upcoming: 'Upcoming',
    draft: 'Draft',
    published: 'Published',
    notStarted: 'Not Started',
  },

  // Page titles
  pages: {
    dashboard: 'Dashboard',
    programs: 'Programs',
    development: 'Development',
    scheduling: 'Schedule',
    insights: 'Insights',
    precheck: 'System Check',
    discovery: 'Component Discovery',
  },

  // Dashboard
  dashboard: {
    welcome: 'Welcome back',
    activePrograms: 'Active Programs',
    completedReports: 'Completed Reports',
    upcomingDeadlines: 'Upcoming Deadlines',
    assessmentsCenters: 'Assessment Centers',
  },

  // Programs
  programs: {
    title: 'Programs',
    instructions: 'Instructions',
    tasks: 'Tasks',
    startProgram: 'Start Program',
    viewDetails: 'View Details',
    sequential: 'Sequential',
    open: 'Open',
  },

  // Assessment / Exercise types
  exercise: {
    types: {
      video: 'Video',
      exercise: 'Exercise',
      assessment: 'Assessment',
      document: 'Document',
      quiz: 'Quiz',
    },
  },

  // Pre-check
  precheck: {
    title: 'System Check',
    subtitle: 'Verifying your device before you begin the assessment.',
    checks: {
      camera: 'Camera',
      microphone: 'Microphone',
      internet: 'Internet Connection',
      browser: 'Browser Compatibility',
    },
    checkStatus: {
      pass: 'Passed',
      fail: 'Failed',
      pending: 'Waiting',
      running: 'Checking…',
    },
  },

  // IDP / Development
  idp: {
    title: 'Individual Development Plan',
    coach: 'IDP Coach',
    placeholder: 'Ask me to add goals, suggest skills, or review your plan…',
    planTitle: 'Development Plan',
    skills: 'Skills',
    milestones: 'Milestones',
    noGoals: 'No goals yet. Add a development goal to get started.',
    skillLevels: {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      expert: 'Expert',
      master: 'Master',
    },
  },

  // Calendar / Scheduling
  schedule: {
    title: 'Schedule',
    views: {
      day: 'Day',
      week: 'Week',
      month: 'Month',
    },
    noEvents: 'No events scheduled',
    eventTypes: {
      assessment: 'Assessment',
      interview: 'Interview',
      training: 'Training',
      review: 'Review',
      other: 'Other',
    },
  },

  // Insights
  insights: {
    title: 'Insights',
    reports: 'Reports',
    charts: 'Charts',
    period: 'Period',
    periods: {
      week: 'This Week',
      month: 'This Month',
      quarter: 'This Quarter',
      year: 'This Year',
    },
    chartComingSoon: 'Chart coming soon',
  },

  // Header
  header: {
    toggleMenu: 'Toggle menu',
    notifications: 'Notifications',
    switchToDark: 'Switch to dark mode',
    switchToLight: 'Switch to light mode',
    online: 'Online',
  },

  // Accessibility
  a11y: {
    loading: 'Loading…',
    expandSidebar: 'Expand sidebar',
    collapseSidebar: 'Collapse sidebar',
    typingIndicator: 'Assistant is typing',
    messageInput: 'Message input',
  },
};

export type Translations = typeof en;
