export interface Opportunity {
  id: string
  category: 'scholarships' | 'admissions' | 'jobs' | 'grants'
  type: string
  verified?: boolean
  org: string
  title: string
  description: string
  location: string
  deadline: string
  urgent?: boolean
  flags: string[]
  applyUrl: string
}

export type PostFilter = 'urgent' | 'month' | 'karachi' | 'new'

export const filterOptions: {
  groupId: 'types' | 'deadline' | 'scope'
  label: string
  options: { id: string; label: string }[]
  type: 'checkbox' | 'radio'
}[] = [
  {
    groupId: 'types',
    label: 'Type',
    type: 'checkbox',
    options: [
      { id: 'scholarships', label: 'Scholarships' },
      { id: 'admissions', label: 'Admissions' },
      { id: 'jobs', label: 'Jobs & Internships' },
      { id: 'grants', label: 'Grants' },
    ],
  },
  {
    groupId: 'deadline',
    label: 'Deadline',
    type: 'radio',
    options: [
      { id: 'all', label: 'Any deadline' },
      { id: 'urgent', label: 'Urgent (< 7 days)' },
      { id: 'month', label: 'Closing this month' },
      { id: 'new', label: 'New this week' },
    ],
  },
  {
    groupId: 'scope',
    label: 'Location',
    type: 'checkbox',
    options: [{ id: 'karachi', label: 'Karachi only' }],
  },
]

export const opportunities: Opportunity[] = [
  {
    id: 'hec-need',
    category: 'scholarships',
    type: 'Scholarship',
    verified: true,
    org: 'Higher Education Commission Pakistan',
    title: 'HEC Need-Based Undergraduate Scholarship',
    description:
      'Need-based support for enrolled undergraduate students at recognised Pakistani universities. Eligibility, income documentation and the current application window are on the HEC scholarship portal.',
    location: 'Nationwide',
    deadline: 'November 2, 2026',
    urgent: true,
    flags: ['urgent'],
    applyUrl: 'https://scholarships.hec.gov.pk/',
  },
  {
    id: 'systems-trainee',
    category: 'jobs',
    type: 'Job & Internship',
    verified: true,
    org: 'Systems Limited',
    title: 'Graduate Trainee Engineer Programme',
    description:
      'Early-career engineering roles across software, cloud and data teams. Openings, eligibility and application steps are listed on the Systems careers page.',
    location: 'Karachi',
    deadline: 'October 31, 2026',
    urgent: true,
    flags: ['urgent', 'month', 'karachi'],
    applyUrl: 'https://systemsltd.com/careers/',
  },
  {
    id: 'chevening',
    category: 'scholarships',
    type: 'Scholarship',
    verified: true,
    org: 'Chevening / UK Government',
    title: 'Chevening Scholarships for Pakistan',
    description:
      "UK government funding for one-year master's study. Check eligibility, priority subjects and the annual application window on the Chevening Pakistan page.",
    location: 'United Kingdom',
    deadline: 'November 4, 2026',
    flags: ['urgent', 'new'],
    applyUrl: 'https://www.chevening.org/scholarship/pakistan/',
  },
  {
    id: 'ignite-ngiri',
    category: 'grants',
    type: 'Grant',
    verified: true,
    org: 'National Technology Fund (IGNITE)',
    title: 'IGNITE NGIRI Research & Innovation Grant',
    description:
      'Funding for final-year student projects and early-stage research teams. Programme guidelines, eligibility and submission templates are on the IGNITE portal.',
    location: 'Nationwide',
    deadline: 'November 15, 2026',
    flags: [],
    applyUrl: 'https://ignite.org.pk/ngiri/',
  },
  {
    id: 'nust-admissions',
    category: 'admissions',
    type: 'Admission',
    verified: true,
    org: 'National University of Sciences & Technology',
    title: 'NUST Undergraduate & Graduate Admissions',
    description:
      'Admissions across engineering, computing and sciences. Entry tests, merit lists and deadlines are posted on the NUST admissions portal.',
    location: 'Islamabad',
    deadline: 'November 20, 2026',
    flags: ['new'],
    applyUrl: 'https://ugadmissions.nust.edu.pk/',
  },
  {
    id: 'sindh-hec-indigenous',
    category: 'scholarships',
    type: 'Scholarship',
    org: 'Sindh Higher Education Commission',
    title: 'Sindh HEC Indigenous Scholarship',
    description:
      'Scholarships for postgraduate study at universities in Sindh. Eligibility criteria and the application schedule are published by Sindh HEC.',
    location: 'Sindh',
    deadline: 'November 25, 2026',
    flags: ['karachi'],
    applyUrl: 'https://shec.gov.pk/',
  },
  {
    id: 'nestle-internship',
    category: 'jobs',
    type: 'Job & Internship',
    org: 'Nestlé Pakistan',
    title: 'Internships & Management Trainee Programme',
    description:
      'Internships and trainee openings across operations, supply chain and marketing. Applications are handled through the Nestlé Pakistan careers site.',
    location: 'Karachi & Lahore',
    deadline: 'November 10, 2026',
    flags: ['new', 'karachi'],
    applyUrl: 'https://www.nestle.pk/jobs',
  },
  {
    id: 'iba-admissions',
    category: 'admissions',
    type: 'Admission',
    verified: true,
    org: 'Institute of Business Administration (IBA) Karachi',
    title: 'IBA Karachi Graduate Admissions',
    description:
      'Graduate programmes in computing, business and data. Review admission requirements, test dates and scholarship options on the IBA admissions site.',
    location: 'Karachi',
    deadline: 'December 5, 2026',
    flags: ['karachi'],
    applyUrl: 'https://admissions.iba.edu.pk/',
  },
  {
    id: 'nic-karachi',
    category: 'grants',
    type: 'Grant',
    org: 'National Incubation Center Karachi',
    title: 'Startup Incubation Cohort',
    description:
      'Incubation, mentorship and early-stage support for technology startups. Cohort timelines and application details are on the NIC Karachi site.',
    location: 'Karachi',
    deadline: 'December 1, 2026',
    flags: ['karachi'],
    applyUrl: 'https://nickarachi.pk/',
  },
  {
    id: 'ke-trainee',
    category: 'jobs',
    type: 'Job & Internship',
    org: 'K-Electric',
    title: 'Graduate Trainee & Engineering Programme',
    description:
      'Graduate trainee and engineering roles in power distribution and utilities. Current programmes are listed on the K-Electric careers page.',
    location: 'Karachi',
    deadline: 'November 18, 2026',
    flags: ['karachi'],
    applyUrl: 'https://www.ke.com.pk/career/',
  },
  {
    id: 'lums-nop',
    category: 'scholarships',
    type: 'Scholarship',
    org: 'LUMS',
    title: 'National Outreach Programme (NOP)',
    description:
      'Need-blind financial aid pathway for high-potential students. Eligibility criteria and the application process are detailed by LUMS NOP.',
    location: 'Lahore',
    deadline: 'December 15, 2026',
    flags: [],
    applyUrl: 'https://nop.lums.edu.pk/',
  },
  {
    id: 'undp-internship',
    category: 'jobs',
    type: 'Job & Internship',
    org: 'UNDP Pakistan',
    title: 'Internships & Early-Career Roles',
    description:
      'Internships and junior roles supporting development programmes in Pakistan. Current openings are listed on the UNDP Pakistan jobs page.',
    location: 'Islamabad & Karachi',
    deadline: 'Rolling basis',
    flags: ['new'],
    applyUrl: 'https://www.undp.org/pakistan/jobs',
  },
  {
    id: 'australia-awards',
    category: 'scholarships',
    type: 'Scholarship',
    org: 'Australian Government',
    title: 'Australia Awards Scholarships — Pakistan',
    description:
      'Australian government scholarships for postgraduate study and research. Country-specific eligibility and application dates are on the Australia Awards Pakistan page.',
    location: 'Australia',
    deadline: 'January 31, 2027',
    flags: [],
    applyUrl:
      'https://www.dfat.gov.au/people-to-people/australia-awards/australia-awards-pakistan',
  },
  {
    id: 'fulbright',
    category: 'scholarships',
    type: 'Scholarship',
    verified: true,
    org: 'USEFP',
    title: 'Fulbright Foreign Student Program',
    description:
      'Fully funded graduate study in the United States for Pakistani citizens. Check eligibility, GRE requirements and the annual application timeline at USEFP.',
    location: 'United States',
    deadline: 'May 14, 2027',
    flags: ['new'],
    applyUrl: 'https://www.usefp.org/scholarships',
  },
]

export const deadlinesThisWeek = [
  {
    title: 'Systems Graduate Trainee Programme',
    status: 'Closes Oct 31',
    urgent: true,
    required: 'Updated CV',
    linkLabel: 'Open Careers Page',
    url: 'https://systemsltd.com/careers/',
  },
  {
    title: 'HEC Need-Based Undergraduate Scholarship',
    status: 'Due Nov 2',
    urgent: true,
    required: 'Income Certificate',
    linkLabel: 'Open Portal',
    url: 'https://scholarships.hec.gov.pk/',
  },
  {
    title: 'Chevening Scholarships for Pakistan',
    status: 'Closes Nov 4',
    urgent: false,
    required: 'Two References',
    linkLabel: 'Open Guide',
    url: 'https://www.chevening.org/scholarship/pakistan/',
  },
]

/* ---------------- Applications tracker ---------------- */

export interface TrackedAction {
  icon: string
  label: string
  primary: boolean
  href?: string
}

export interface RequirementItem {
  id: string
  label: string
  done: boolean
}

export interface TrackedApplication {
  id: string
  column: string
  type: string
  due: { text: string; urgent: boolean }
  title: string
  org: string
  progress?: { label: string; value: string; warning: string }
  requirements?: RequirementItem[]
  note?: string
  actions: TrackedAction[]
}

export const trackedApplications: TrackedApplication[] = [
  {
    id: 'sindh-hec',
    column: 'preparing',
    type: 'Scholarship',
    due: { text: 'Due Nov 25', urgent: false },
    title: 'Sindh HEC Indigenous Scholarship',
    org: 'Sindh Higher Education Commission',
    progress: {
      label: 'Document Readiness',
      value: '2 of 4 ready',
      warning: 'Needs: HOD recommendation letter',
    },
    actions: [
      { icon: 'checklist', label: 'Checklist', primary: false },
      { icon: 'open_in_new', label: 'Portal', primary: true, href: 'https://shec.gov.pk/' },
    ],
  },
  {
    id: 'hec-need-tracked',
    column: 'applied',
    type: 'Scholarship',
    due: { text: 'Due Nov 2', urgent: true },
    title: 'HEC Need-Based Undergraduate Scholarship',
    org: 'Higher Education Commission Pakistan',
    note: 'Application submitted online. Keep the submission receipt and a portal screenshot for follow-up.',
    actions: [
      { icon: 'receipt_long', label: 'Receipt', primary: false },
      {
        icon: 'open_in_new',
        label: 'Track',
        primary: true,
        href: 'https://scholarships.hec.gov.pk/',
      },
    ],
  },
  {
    id: 'ignite-ngiri-tracked',
    column: 'review',
    type: 'Grant',
    due: { text: 'Result: Nov 15', urgent: false },
    title: 'IGNITE NGIRI Research Grant',
    org: 'National Technology Fund (IGNITE)',
    note: 'Proposal submitted for technical review. Monitor the IGNITE portal for updates.',
    actions: [
      { icon: 'description', label: 'Guidelines', primary: false },
      { icon: 'open_in_new', label: 'Portal', primary: true, href: 'https://ignite.org.pk/ngiri/' },
    ],
  },
  {
    id: 'systems-ase',
    column: 'offered',
    type: 'Graduate Trainee',
    due: { text: 'Respond by Oct 31', urgent: true },
    title: 'Systems Limited Graduate Trainee Engineer',
    org: 'Systems Limited, Karachi',
    note: 'Offer received. Review the joining date and respond through the recruitment portal.',
    actions: [
      { icon: 'upload_file', label: 'Documents', primary: false },
      {
        icon: 'verified',
        label: 'Respond',
        primary: true,
        href: 'https://systemsltd.com/careers/',
      },
    ],
  },
  {
    id: 'iba-ms-tracked',
    column: 'preparing',
    type: 'Admission',
    due: { text: 'Due Dec 5', urgent: false },
    title: 'IBA Karachi Graduate Admissions',
    org: 'Institute of Business Administration',
    progress: {
      label: 'Application Progress',
      value: '1 of 3 steps',
      warning: 'Needs: Statement of purpose',
    },
    actions: [
      { icon: 'edit_note', label: 'Notes', primary: false },
      { icon: 'open_in_new', label: 'Apply', primary: true, href: 'https://admissions.iba.edu.pk/' },
    ],
  },
  {
    id: 'fulbright-tracked',
    column: 'applied',
    type: 'Scholarship',
    due: { text: 'Interview stage', urgent: false },
    title: 'Fulbright Foreign Student Program',
    org: 'USEFP',
    note: 'Application submitted. Prepare transcripts and reference letters for the interview stage.',
    actions: [
      { icon: 'description', label: 'Documents', primary: false },
      { icon: 'open_in_new', label: 'Portal', primary: true, href: 'https://www.usefp.org/scholarships' },
    ],
  },
]

export const kanbanColumns = [
  { id: 'preparing', label: 'Preparing', dot: 'bg-charcoal-muted' },
  { id: 'applied', label: 'Applied', dot: 'bg-urgent-red' },
  { id: 'review', label: 'In Review', dot: 'bg-secondary' },
  { id: 'offered', label: 'Offered / Accepted', dot: 'bg-urdu-green-deep' },
]

export const upcomingDeadlines = [
  {
    month: 'Oct',
    day: '31',
    urgent: true,
    title: 'Systems Graduate Trainee applications close',
    place: 'Systems Limited careers portal',
  },
  {
    month: 'Nov',
    day: '02',
    urgent: true,
    title: 'HEC Need-Based Scholarship submission',
    place: 'HEC online scholarship portal',
  },
  {
    month: 'Nov',
    day: '04',
    urgent: false,
    title: 'Chevening application window closes',
    place: 'Chevening Pakistan website',
  },
  {
    month: 'Nov',
    day: '15',
    urgent: false,
    title: 'IGNITE NGIRI review results expected',
    place: 'IGNITE applicant portal',
  },
]

/* ---------------- Upcoming cycles ---------------- */

export interface CycleProgramme {
  id: string
  category: Opportunity['category']
  type: string
  org: string
  title: string
  opensYear: number
  opensMonth: number
  usuallyOpens: string
  window: string
  lastCycle: string
  consistency: string
  applyUrl: string
}

export const upcomingCycles: CycleProgramme[] = [
  {
    id: 'stipendium-hungaricum',
    category: 'scholarships',
    type: 'Scholarship',
    org: 'Tempus Public Foundation',
    title: 'Stipendium Hungaricum 2027–28',
    opensYear: 2026,
    opensMonth: 10,
    usuallyOpens: 'November',
    window: 'Opens early November, closes mid-January.',
    lastCycle: '1 Nov 2025 – 15 Jan 2026',
    consistency: 'Same month 4 years running',
    applyUrl: 'https://stipendiumhungaricum.hu/',
  },
  {
    id: 'csc-chinese-government',
    category: 'scholarships',
    type: 'Scholarship',
    org: 'China Scholarship Council',
    title: 'Chinese Government Scholarship (CSC)',
    opensYear: 2026,
    opensMonth: 11,
    usuallyOpens: 'December',
    window: 'Opens in December, university deadlines run to March.',
    lastCycle: '10 Dec 2025 – 31 Mar 2026',
    consistency: 'Same month 3 years running',
    applyUrl: 'https://www.campuschina.org/',
  },
  {
    id: 'turkiye-burslari',
    category: 'scholarships',
    type: 'Scholarship',
    org: 'Türkiye Scholarships',
    title: 'Türkiye Bursları 2027',
    opensYear: 2027,
    opensMonth: 0,
    usuallyOpens: 'January',
    window: 'Opens 10 January, closes 20 February.',
    lastCycle: '10 Jan – 20 Feb 2026',
    consistency: 'Same month 5 years running',
    applyUrl: 'https://turkiyeburslari.gov.tr/',
  },
  {
    id: 'fulbright-cycle',
    category: 'scholarships',
    type: 'Scholarship',
    org: 'USEFP',
    title: 'Fulbright Foreign Student Program',
    opensYear: 2027,
    opensMonth: 1,
    usuallyOpens: 'February',
    window: 'Opens in February, closes mid-May.',
    lastCycle: '14 Feb – 14 May 2026',
    consistency: 'Same month 6 years running',
    applyUrl: 'https://www.usefp.org/scholarships',
  },
  {
    id: 'google-summer-of-code',
    category: 'jobs',
    type: 'Internship',
    org: 'Google',
    title: 'Google Summer of Code 2027',
    opensYear: 2027,
    opensMonth: 2,
    usuallyOpens: 'March',
    window: 'Contributor applications usually open in March.',
    lastCycle: '18 Mar – 2 Apr 2026',
    consistency: 'Same month 5 years running',
    applyUrl: 'https://summerofcode.withgoogle.com/',
  },
  {
    id: 'daad-epos',
    category: 'scholarships',
    type: 'Scholarship',
    org: 'DAAD',
    title: 'DAAD EPOS Development-Related Courses',
    opensYear: 2027,
    opensMonth: 7,
    usuallyOpens: 'August',
    window: 'Opens in August, course deadlines run to October.',
    lastCycle: '1 Aug – 15 Oct 2026',
    consistency: 'Same month 4 years running',
    applyUrl: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/',
  },
]
