import type { Translations } from './en';

export const hi: Translations = {
  // Navigation
  nav: {
    dashboard: 'डैशबोर्ड',
    programs: 'कार्यक्रम',
    development: 'विकास',
    scheduling: 'अनुसूची',
    insights: 'अंतर्दृष्टि',
    discovery: 'खोज',
    collapse: 'संकुचित करें',
  },

  // Common actions
  actions: {
    save: 'सहेजें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    add: 'जोड़ें',
    retry: 'पुनः प्रयास करें',
    continue: 'जारी रखें',
    back: 'वापस',
    next: 'अगला',
    close: 'बंद करें',
    search: 'खोजें',
    filter: 'फ़िल्टर',
    send: 'भेजें',
    submit: 'सबमिट करें',
    confirm: 'पुष्टि करें',
    bookSlot: 'स्लॉट बुक करें',
    addGoal: 'लक्ष्य जोड़ें',
    addFirstGoal: 'पहला लक्ष्य जोड़ें',
    retryFailedChecks: 'विफल जांच फिर से करें',
    continueToAssessment: 'मूल्यांकन पर जाएं',
  },

  // Status labels
  status: {
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    completed: 'पूर्ण',
    inProgress: 'प्रगति में',
    pending: 'लंबित',
    locked: 'बंद',
    available: 'उपलब्ध',
    full: 'भरा हुआ',
    upcoming: 'आगामी',
    draft: 'मसौदा',
    published: 'प्रकाशित',
    notStarted: 'शुरू नहीं हुआ',
  },

  // Page titles
  pages: {
    dashboard: 'डैशबोर्ड',
    programs: 'कार्यक्रम',
    development: 'विकास',
    scheduling: 'अनुसूची',
    insights: 'अंतर्दृष्टि',
    precheck: 'सिस्टम जांच',
    discovery: 'घटक खोज',
  },

  // Dashboard
  dashboard: {
    welcome: 'वापस स्वागत है',
    activePrograms: 'सक्रिय कार्यक्रम',
    completedReports: 'पूर्ण रिपोर्ट',
    upcomingDeadlines: 'आगामी समय सीमाएं',
    assessmentsCenters: 'मूल्यांकन केंद्र',
  },

  // Programs
  programs: {
    title: 'कार्यक्रम',
    instructions: 'निर्देश',
    tasks: 'कार्य',
    startProgram: 'कार्यक्रम शुरू करें',
    viewDetails: 'विवरण देखें',
    sequential: 'क्रमिक',
    open: 'खुला',
  },

  // Assessment / Exercise types
  exercise: {
    types: {
      video: 'वीडियो',
      exercise: 'अभ्यास',
      assessment: 'मूल्यांकन',
      document: 'दस्तावेज़',
      quiz: 'प्रश्नोत्तरी',
    },
  },

  // Pre-check
  precheck: {
    title: 'सिस्टम जांच',
    subtitle: 'मूल्यांकन शुरू करने से पहले आपके डिवाइस की जांच की जा रही है।',
    checks: {
      camera: 'कैमरा',
      microphone: 'माइक्रोफ़ोन',
      internet: 'इंटरनेट कनेक्शन',
      browser: 'ब्राउज़र संगतता',
    },
    checkStatus: {
      pass: 'पास',
      fail: 'विफल',
      pending: 'प्रतीक्षा में',
      running: 'जांच हो रही है…',
    },
  },

  // IDP / Development
  idp: {
    title: 'व्यक्तिगत विकास योजना',
    coach: 'IDP कोच',
    placeholder: 'मुझसे लक्ष्य जोड़ने, कौशल सुझाने, या योजना की समीक्षा करने के लिए कहें…',
    planTitle: 'विकास योजना',
    skills: 'कौशल',
    milestones: 'मील के पत्थर',
    noGoals: 'अभी तक कोई लक्ष्य नहीं। शुरू करने के लिए एक विकास लक्ष्य जोड़ें।',
    skillLevels: {
      beginner: 'शुरुआती',
      intermediate: 'मध्यवर्ती',
      advanced: 'उन्नत',
      expert: 'विशेषज्ञ',
      master: 'मास्टर',
    },
  },

  // Calendar / Scheduling
  schedule: {
    title: 'अनुसूची',
    views: {
      day: 'दिन',
      week: 'सप्ताह',
      month: 'माह',
    },
    noEvents: 'कोई कार्यक्रम निर्धारित नहीं',
    eventTypes: {
      assessment: 'मूल्यांकन',
      interview: 'साक्षात्कार',
      training: 'प्रशिक्षण',
      review: 'समीक्षा',
      other: 'अन्य',
    },
  },

  // Insights
  insights: {
    title: 'अंतर्दृष्टि',
    reports: 'रिपोर्ट',
    charts: 'चार्ट',
    period: 'अवधि',
    periods: {
      week: 'इस सप्ताह',
      month: 'इस माह',
      quarter: 'इस तिमाही',
      year: 'इस वर्ष',
    },
    chartComingSoon: 'चार्ट जल्द आएगा',
  },

  // Header
  header: {
    toggleMenu: 'मेनू टॉगल करें',
    notifications: 'सूचनाएं',
    switchToDark: 'डार्क मोड पर जाएं',
    switchToLight: 'लाइट मोड पर जाएं',
    online: 'ऑनलाइन',
  },

  // Accessibility
  a11y: {
    loading: 'लोड हो रहा है…',
    expandSidebar: 'साइडबार विस्तृत करें',
    collapseSidebar: 'साइडबार संकुचित करें',
    typingIndicator: 'सहायक टाइप कर रहा है',
    messageInput: 'संदेश इनपुट',
  },
};
