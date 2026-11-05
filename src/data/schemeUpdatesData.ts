import { IconName } from '../components/ui/icons'

export interface SchemeAnnouncement {
  id: string
  schemeName: string
  announcementTitle: string
  announcementType:
    | 'Application Open'
    | 'Application Deadline'
    | 'Registration Update'
    | 'Instalment Update'
    | 'Scheme Announcement'
    | 'Document Update'
    | 'State Scheme Update'
  shortDescription: string
  publishedDate: string
  applicationDeadline: string
  highlightBadge: string
  sourceName: string
  officialSourceUrl: string
  lastVerifiedAt: string
  state?: string
  status: 'active' | 'archived'
  iconName: IconName
}

/**
 * Verified official government scheme announcements.
 * Sourced directly from official ministry portals, Press Information Bureau (PIB),
 * and scheme databases.
 */
export const VERIFIED_SCHEME_UPDATES: SchemeAnnouncement[] = [
  {
    id: 'pmay-u-2',
    schemeName: 'PM Awas Yojana (PMAY-U 2.0)',
    announcementTitle: 'Citizen Demand Survey & Registrations Active',
    announcementType: 'Application Open',
    shortDescription: 'Government invites online applications for interest subsidy and affordable housing under PMAY Urban 2.0.',
    publishedDate: '2024-09-01',
    applicationDeadline: 'Active for FY 2024–2029',
    highlightBadge: 'Apply Now',
    sourceName: 'Ministry of Housing and Urban Affairs (MoHUA)',
    officialSourceUrl: 'https://pmaymis.gov.in/',
    lastVerifiedAt: '2025-01-15',
    status: 'archived',
    iconName: 'home',
  },
  {
    id: 'pm-kisan-19',
    schemeName: 'PM-KISAN',
    announcementTitle: 'Mandatory eKYC & Aadhaar-Bank Seeding for Next Installment',
    announcementType: 'Instalment Update',
    shortDescription: 'Registered farmers must complete OTP-based or biometric eKYC on the portal before direct benefit transfer.',
    publishedDate: '2024-10-05',
    applicationDeadline: 'Mandatory Requirement',
    highlightBadge: 'eKYC Mandatory',
    sourceName: 'Ministry of Agriculture & Farmers Welfare',
    officialSourceUrl: 'https://pmkisan.gov.in/',
    lastVerifiedAt: '2025-01-15',
    status: 'archived',
    iconName: 'agriculture',
  },
  {
    id: 'pm-vidyalaxmi',
    schemeName: 'PM Vidyalaxmi Scheme',
    announcementTitle: 'Collateral-free education loans have no maximum amount; ₹10 lakh is the interest-subvention principal limit',
    announcementType: 'Scheme Announcement',
    shortDescription: 'Central sector scheme launched for students admitted in top 860 NIRF-ranked Higher Education Institutions.',
    publishedDate: '2024-11-06',
    applicationDeadline: 'Academic Year 2024–25',
    highlightBadge: 'Interest support up to ₹10L principal',
    sourceName: 'Department of Higher Education, Ministry of Education',
    officialSourceUrl: 'https://pmvidyalaxmi.co.in/',
    lastVerifiedAt: '2025-01-15',
    status: 'archived',
    iconName: 'school',
  },
  {
    id: 'ayushman-70-plus',
    schemeName: 'Ayushman Bharat (PM-JAY)',
    announcementTitle: 'Ayushman Vaya Vandana Card for All Senior Citizens 70+',
    announcementType: 'Registration Update',
    shortDescription: 'Free healthcare coverage up to ₹5 Lakh/year now available to all seniors aged 70 years and above, irrespective of income.',
    publishedDate: '2024-10-29',
    applicationDeadline: 'Open Enrollment',
    highlightBadge: 'Seniors 70+ Card',
    sourceName: 'National Health Authority (NHA)',
    officialSourceUrl: 'https://beneficiary.nha.gov.in/',
    lastVerifiedAt: '2025-01-15',
    status: 'archived',
    iconName: 'health',
  },
  {
    id: 'pm-surya-ghar',
    schemeName: 'PM Surya Ghar: Muft Bijli Yojana',
    announcementTitle: 'Rooftop Solar Subsidy up to ₹78,000 for Households',
    announcementType: 'Application Open',
    shortDescription: 'Direct financial assistance credited to bank accounts for installing residential solar systems with 300 free monthly units.',
    publishedDate: '2024-02-15',
    applicationDeadline: 'Active National Portal',
    highlightBadge: 'Subsidy ₹78,000',
    sourceName: 'Ministry of New and Renewable Energy (MNRE)',
    officialSourceUrl: 'https://pmsuryaghar.gov.in/',
    lastVerifiedAt: '2025-01-15',
    status: 'archived',
    iconName: 'storefront',
  },
  {
    id: 'lakhpati-didi',
    schemeName: 'Lakhpati Didi (DAY-NRLM)',
    announcementTitle: 'Skill & Livelihood Expansion for Women SHG Members',
    announcementType: 'Scheme Announcement',
    shortDescription: 'Targeting sustainable income of ₹1 Lakh+ annually per household through micro-enterprises and community training.',
    publishedDate: '2024-03-01',
    applicationDeadline: 'National Rollout Active',
    highlightBadge: 'SHG Expansion',
    sourceName: 'Ministry of Rural Development',
    officialSourceUrl: 'https://nrlm.gov.in/',
    lastVerifiedAt: '2025-01-15',
    status: 'archived',
    iconName: 'family',
  },
]
