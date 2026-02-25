/** Mock IDP (Individual Development Plan) data. */

import type { IDPSkill, ChatQuestion, SkillLibrary, DevelopmentPlan } from '@/types/idp';
import type { Comment } from '@/types/user';

export const mockIdpSkills: IDPSkill[] = [
  {
    name: 'Influence & Communication',
    desc: 'Strengthen ability to persuade, align stakeholders, and communicate with impact across organizational levels.',
    private: false,
    skillType: 'behavioral',
    tips: [
      {
        id: 't1',
        type: '70',
        title: 'Lead a Cross-Functional Initiative',
        desc: 'Volunteer to lead a project spanning 2+ departments. Practice influencing without direct authority by building coalitions and aligning competing priorities.',
        source: 'ai',
        startDate: 'Mar 2026',
        endDate: 'Jun 2026',
        success: 'Successfully deliver cross-functional project with measurable stakeholder satisfaction improvement.',
        insight: 'Your assessment showed strong analytical skills but lower scores in lateral influence. This experiential assignment directly targets that gap.',
        category: 'experience',
      },
      {
        id: 't2',
        type: '20',
        title: 'Executive Mentoring Program',
        desc: 'Pair with a senior leader known for stakeholder management excellence. Shadow their key meetings and debrief on influence strategies used.',
        source: 'library',
        startDate: 'Mar 2026',
        endDate: 'Aug 2026',
        success: 'Complete 6 mentoring sessions with documented learnings and at least 2 strategies applied in own work.',
        insight: 'You mentioned wanting to grow into a more senior role. Learning from executives who have mastered influence accelerates this path.',
        category: 'social',
      },
      {
        id: 't3',
        type: '10',
        title: 'Stakeholder Influence Masterclass',
        desc: 'Build techniques for persuading and aligning diverse stakeholders across organizational levels.',
        source: 'library',
        startDate: 'Apr 2026',
        endDate: 'Apr 2026',
        success: 'Complete course and apply RACI framework to at least one active project.',
        insight: 'A focused 4-week course that directly addresses the gap identified in your competency assessment.',
        category: 'course',
        provider: 'LinkedIn Learning',
        duration: '4 hrs',
        seats: null,
      },
    ],
  },
  {
    name: 'Team Development',
    desc: 'Build capability in coaching, delegating, and developing team members to reach their full potential.',
    private: false,
    skillType: 'behavioral',
    tips: [
      {
        id: 't4',
        type: '70',
        title: 'Delegate a High-Visibility Deliverable',
        desc: 'Identify a key deliverable you normally own and delegate it fully to a direct report. Provide coaching support but resist taking it back.',
        source: 'ai',
        startDate: 'Mar 2026',
        endDate: 'May 2026',
        success: 'Direct report delivers the project independently with quality meeting or exceeding standards.',
        insight: 'Deliberate delegation builds the team while freeing your capacity for strategic work.',
        category: 'experience',
      },
      {
        id: 't5',
        type: '20',
        title: 'Coaching Skills for Leaders',
        desc: 'Structured coaching program with Internal L&D focused on active listening, powerful questions, and development conversations.',
        source: 'library',
        startDate: 'Apr 2026',
        endDate: 'Jul 2026',
        success: 'Complete all 6 coaching sessions and demonstrate measurable improvement in 360° feedback on coaching behaviors.',
        insight: 'This internal program was selected because you indicated interest in hands-on practice and peer learning formats.',
        category: 'course',
        provider: 'Internal L&D',
        duration: '6 sessions',
        seats: 8,
      },
      {
        id: 't6',
        type: '10',
        title: 'Radical Candor — Kim Scott',
        desc: 'Framework for caring personally while challenging directly. Learn the practical methodology for giving feedback that drives growth.',
        source: 'ai',
        startDate: 'Apr 2026',
        endDate: 'May 2026',
        success: 'Read and apply the SBI feedback model in at least 3 development conversations with direct reports.',
        insight: 'Reading complements your experiential learning. This book directly addresses the feedback skills gap identified in your assessment.',
        category: 'reading',
      },
    ],
  },
  {
    name: 'Decision Making',
    desc: 'Improve speed and quality of decisions under ambiguity, and strengthen stakeholder buy-in on tough calls.',
    private: false,
    skillType: 'behavioral',
    tips: [
      {
        id: 't7',
        type: '70',
        title: 'Decision Journal Practice',
        desc: 'Start a structured decision journal documenting key decisions, context, rationale, and outcomes. Review monthly to identify patterns and biases.',
        source: 'ai',
        startDate: 'Mar 2026',
        endDate: 'Sep 2026',
        success: 'Maintain consistent journal for 6 months with at least 12 documented decisions and monthly retrospective.',
        insight: 'This practice builds meta-cognitive awareness of your decision patterns and helps you learn from both successes and mistakes.',
        category: 'experience',
      },
      {
        id: 't8',
        type: '10',
        title: 'Thinking in Bets — Annie Duke',
        desc: 'Learn to make better decisions under uncertainty by thinking probabilistically and separating process from outcomes.',
        source: 'library',
        startDate: 'Mar 2026',
        endDate: 'Apr 2026',
        success: 'Apply probabilistic thinking framework to at least 3 major decisions with documented reasoning.',
        insight: 'Addresses the ambiguity challenge you identified in your profile assessment.',
        category: 'reading',
      },
    ],
  },
];

export const mockComments: Record<string, Comment[]> = {
  t7: [
    {
      from: 'manager',
      name: 'Sarah Chen',
      text: "I've been doing a decision journal for 2 years — happy to share my template.",
      ts: 'Feb 20',
    },
    {
      from: 'user',
      name: 'Kshitij',
      text: 'Yes please! That would save me setup time.',
      ts: 'Feb 21',
    },
  ],
};

export const mockTipProgress: DevelopmentPlan['tipProgress'] = {};

export const chatQuestions: ChatQuestion[] = [
  {
    q: 'What do you enjoy most about your current role?',
    suggestions: [
      'Strategic planning and big-picture thinking',
      'Leading and mentoring my team',
      'Solving complex problems',
      'Cross-functional collaboration',
      'Building stakeholder relationships',
    ],
  },
  {
    q: 'What aspects of your role do you find most challenging or less enjoyable?',
    suggestions: [
      'Navigating organizational politics',
      'Managing conflicting priorities',
      'Difficult conversations with direct reports',
      'Data-heavy reporting and analysis',
      'Keeping up with rapid change',
    ],
  },
  {
    q: 'Are you looking to grow in your current role, or considering a transition?',
    suggestions: [
      'Deepen expertise in my current role',
      'Grow into a more senior leadership position',
      'Transition to a different function',
      'Explore a broader cross-functional scope',
      "I'm open — help me figure it out",
    ],
  },
  {
    q: 'What skills do you feel are your strongest and most transferable?',
    suggestions: [
      'Analytical thinking and problem solving',
      'Communication and storytelling',
      'People management and coaching',
      'Strategic planning',
      'Data analysis and technical tools',
    ],
  },
  {
    q: 'What skills would you most like to develop or improve?',
    suggestions: [
      'Executive presence and influence',
      'Coaching and developing others',
      'Decision making under ambiguity',
      'Data analytics and dashboards',
      'Technical platform knowledge',
    ],
  },
  {
    q: "What's your ideal timeline for this development plan?",
    suggestions: [
      '3 months — focused sprint',
      '6 months — steady progress',
      '12 months — comprehensive growth',
      "Flexible — I'll go at my own pace",
    ],
  },
  {
    q: 'How do you prefer to learn?',
    suggestions: [
      'Online courses and videos',
      'Reading books and articles',
      'Hands-on practice and stretch assignments',
      'Coaching and mentoring',
      'Peer learning and group workshops',
    ],
  },
];

export const skillLibrary: SkillLibrary = {
  behavioral: [
    {
      name: 'Strategic Thinking',
      desc: 'Ability to see the big picture, anticipate trends, and plan for long-term success.',
      skillType: 'behavioral',
    },
    {
      name: 'Influence & Communication',
      desc: 'Persuade and align stakeholders; communicate with clarity and impact.',
      skillType: 'behavioral',
    },
    {
      name: 'Team Development',
      desc: 'Coach, delegate, and grow team members to their full potential.',
      skillType: 'behavioral',
    },
    {
      name: 'Resilience',
      desc: 'Maintain effectiveness under pressure and bounce back from setbacks.',
      skillType: 'behavioral',
    },
    {
      name: 'Decision Making',
      desc: 'Make timely, high-quality decisions under ambiguity with stakeholder buy-in.',
      skillType: 'behavioral',
    },
  ],
  technical: [
    {
      name: 'Data Analytics',
      desc: 'Interpret and communicate insights from data using modern analytics tools.',
      skillType: 'technical',
    },
    {
      name: 'Project Management',
      desc: 'Plan, execute, and deliver projects on time and within scope.',
      skillType: 'technical',
    },
    {
      name: 'Financial Acumen',
      desc: 'Understand financial statements and use financial metrics to drive decisions.',
      skillType: 'technical',
    },
  ],
  other: [
    {
      name: 'Executive Presence',
      desc: 'Command attention and inspire confidence in leadership situations.',
      skillType: 'other',
    },
  ],
};

export const mockIdpPlan: DevelopmentPlan = {
  skills: mockIdpSkills,
  status: 'draft',
  comments: mockComments,
  tipProgress: mockTipProgress,
};
