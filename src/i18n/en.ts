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
    book: 'Book',
    bookSlot: 'Book Slot',
    review: 'Review',
    start: 'Start',
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
    booked: 'Booked',
    done: 'Done',
    onTrack: 'On Track',
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
    goodMorning: 'Good morning',
    activePrograms: 'Active Programs',
    avgCompletion: 'Avg. Completion',
    upcomingExercises: 'Upcoming Exercises',
    hoursLogged: 'Hours Logged',
    completedReports: 'Completed Reports',
    upcomingDeadlines: 'Upcoming Deadlines',
    assessmentsCenters: 'Assessment Centers',
    myPrograms: 'My Programs',
    recentReports: 'Recent Reports',
  },

  // Programs
  programs: {
    title: 'Programs',
    instructions: 'Instructions',
    tasks: 'Tasks',
    overview: 'Program Overview',
    beforeYouBegin: 'Before You Begin',
    modules: 'Modules',
    startProgram: 'Start Program',
    continueProgram: 'Continue Program',
    backToDashboard: 'Back to Dashboard',
    viewDetails: 'View Details',
    viewCenter: 'View Center',
    sequential: 'Sequential',
    open: 'Open',
    assessmentCenters: 'Assessment Centers',
    selectExercise: 'Select an exercise to view details',
    proctored: 'Proctored',
    progress: 'Progress',
    lockedExerciseMessage: 'This exercise is locked until previous exercises are completed.',
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
    subtitle: 'Book assessment sessions for your programs',
    myBookings: 'My Bookings',
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
    subtitle: 'Assessment results and development analytics',
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
    reportsAvailable: 'Reports Available',
    avgCompetencyScore: 'Avg. Competency Score',
    completedAssessments: 'Completed Assessments',
    developmentProgress: 'Development Progress',
    competencyScores: 'Competency Scores',
    assessmentReports: 'Assessment Reports',
    scoresBasedOn: 'Scores based on completed assessments',
  },

  // Header
  header: {
    toggleMenu: 'Toggle menu',
    notifications: 'Notifications',
    unread: 'unread',
    switchToDark: 'Switch to dark mode',
    switchToLight: 'Switch to light mode',
    online: 'Online',
    profile: 'Profile',
    settings: 'Settings',
    signOut: 'Sign out',
    noNotifications: 'No new notifications',
    markAllRead: 'Mark all as read',
  },

  // Development page
  development: {
    title: 'Development',
    subtitle: 'Plan and track your professional growth',
    myPlan: 'My Plan',
    myPlanDescription: 'Create and manage your Individual Development Plan (IDP) with personalized goals, skills, and milestones.',
    viewPlan: 'View Plan',
    createPlan: 'Create Plan',
    skillsInFocus: 'Skills in Focus',
    learningResources: 'Learning Resources',
    comingSoon: 'Coming soon',
  },

  // Chat assistant
  chat: {
    title: 'Lighthouse Assistant',
    placeholder: 'Ask me anything about your programs...',
    greeting: 'Hi! I\'m the Lighthouse Assistant. How can I help you today?',
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
