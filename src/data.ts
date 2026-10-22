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
    title: 'HEC Need-Based Undergraduate Scholarship 2025',
    description:
      'Full tuition coverage plus Rs. 6,000 monthly living stipend for enrolled BS students with a minimum 2.8 CGPA.',
    location: 'Karachi campuses',
    deadline: 'March 28, 2025',
    urgent: true,
    flags: ['urgent', 'karachi'],
    applyUrl: 'https://scholarships.hec.gov.pk',
  },
  {
    id: 'ignite-ngiri',
    category: 'grants',
    type: 'Grant',
    verified: true,
    org: 'National Technology Fund (IGNITE)',
    title: 'IGNITE NGIRI Research & Innovation Grant 2025',
    description:
      'Funding of up to PKR 1,000,000 per final-year project team for equipment, cloud services and prototyping.',
    location: 'Karachi',
    deadline: 'March 30, 2025',
    urgent: true,
    flags: ['urgent', 'month'],
    applyUrl: 'https://ignite.org.pk/ngiri',
  },
  {
    id: 'iba-admissions',
    category: 'admissions',
    type: 'Admission',
    org: 'Institute of Business Administration (IBA) Karachi',
    title: 'IBA Karachi Fall 2025 MS Admissions',
    description:
      'MS Computer Science and Data Analytics programs with a merit scholarship for top entrants and evening options.',
    location: 'Karachi',
    deadline: 'April 12, 2025',
    flags: ['month', 'karachi'],
    applyUrl: 'https://admissions.iba.edu.pk',
  },
  {
    id: 'systems-trainee',
    category: 'jobs',
    type: 'Job & Internship',
    org: 'Systems Limited (Karachi Office)',
    title: 'Graduate Trainee Engineer Batch 2025',
    description:
      'Full-time trainee track across cloud, mobile, data engineering and AI operations with benefits and a permanent role.',
    location: 'Karachi',
    deadline: 'April 15, 2025',
    flags: ['month', 'karachi', 'new'],
    applyUrl: 'https://systemsltd.com',
  },
  {
    id: 'fulbright',
    category: 'scholarships',
    type: 'Scholarship',
    org: 'USEFP',
    title: 'Fulbright Foreign Student Program 2026',
    description:
      'Fully funded masters and PhD study in the United States for Pakistani citizens; GRE General exam required.',
    location: 'Pakistan (United States)',
    deadline: 'May 14, 2025',
    flags: ['new'],
    applyUrl: 'https://usefp.org/scholarships/fulbright-degree.cfm',
  },
]

export const deadlinesThisWeek = [
  {
    title: 'HEC Need-Based Undergraduate Scholarship',
    status: 'In 4 days - Fri, 11:59 PM',
    urgent: true,
    required: 'Income Certificate',
    linkLabel: 'Check Form',
  },
  {
    title: 'IGNITE NGIRI FYP Research Grant',
    status: 'In 6 days - Sun, 5:00 PM',
    urgent: false,
    required: 'Dean Sign-off',
    linkLabel: 'FAST Template',
  },
]

/* ---------------- Applications tracker ---------------- */

export const trackedApplications = [
  {
    id: 'sindh-hec',
    column: 'preparing',
    type: 'Scholarship',
    due: { text: '18 days left (Apr 15)', urgent: false },
    title: 'Sindh HEC Indigenous Scholarship 2025',
    org: 'Sindh Higher Education Commission',
    progress: { label: 'Document Readiness', value: '2 of 4 Ready', warning: 'Needs: Dept Dean Recommendation' },
    actions: [
      { icon: 'checklist', label: 'Checklist', primary: false },
      { icon: 'edit_note', label: 'Notes', primary: false },
    ],
  },
  {
    id: 'hec-need-tracked',
    column: 'applied',
    type: 'Scholarship',
    due: { text: '4 days left', urgent: true },
    title: 'HEC Need-Based Undergraduate Scholarship 2025',
    org: 'Higher Education Commission Pakistan',
    note: 'Physical packet submitted at FAST-NU Financial Aid Desk on Mar 20. Awaiting institutional nomination dispatch.',
    actions: [
      { icon: 'receipt_long', label: 'Receipt Docs', primary: false },
      { icon: 'open_in_new', label: 'Track Portal', primary: true },
    ],
  },
  {
    id: 'ignite-ngiri-tracked',
    column: 'review',
    type: 'Grant',
    due: { text: 'Result: Apr 20', urgent: false },
    title: 'IGNITE NGIRI FYP Research Grant 2025',
    org: 'MoITT / ICT R&D Fund Pakistan',
    note: 'Urdu NLP Speech Audio Engine - team of 4 CS seniors, Phase 2 technical review underway.',
    actions: [
      { icon: 'groups', label: 'Team View', primary: false },
      { icon: 'description', label: 'Proposal PDF', primary: false },
    ],
  },
  {
    id: 'systems-ase',
    column: 'offered',
    type: 'Graduate Trainee',
    due: { text: 'Due Mar 31', urgent: false },
    title: 'Systems Limited - Associate Software Engineer',
    org: 'Fast Track Program, Karachi',
    note: 'Formal offer letter received.',
    actions: [
      { icon: 'upload_file', label: 'Upload', primary: false },
      { icon: 'verified', label: 'Acceptance', primary: true },
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
    month: 'Mar',
    day: '28',
    urgent: true,
    title: 'Submit hardcopy docs to FAST Admin',
    place: 'Financial Aid Desk, Karachi Main Campus',
  },
  {
    month: 'Mar',
    day: '31',
    urgent: false,
    title: 'Systems Ltd ASE Offer Sign Deadline',
    place: 'Graduate recruitment onboarding portal',
  },
  {
    month: 'Apr',
    day: '15',
    urgent: false,
    title: 'Sindh HEC Portal Submission Closing',
    place: 'SHEC indigenous online portal cutoff',
  },
]
