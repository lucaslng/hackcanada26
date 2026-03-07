// renewalOptions.ts

export interface RenewalForm {
  id: string;
  label: string;
  /** Official Government of Canada / provincial government URL for this form */
  url?: string;
  /** Short description of what the form is for */
  description?: string;
  /** Whether to download as PDF or open as a web page */
  linkType?: 'pdf' | 'web';
}

export interface RenewalOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  available: boolean;
  requirements: string[];
  forms: RenewalForm[];
  keywords: string[];
}

export const RENEWAL_OPTIONS: RenewalOption[] = [
  {
    id: 'passport',
    title: 'Passport Renewal',
    description: 'Renew an adult or child Canadian passport.',
    icon: 'book_2',
    available: true,
    requirements: [
      'Current or expired passport',
      'Government-issued photo ID',
      'Two passport photos',
      'Completed renewal application',
    ],
    forms: [
      {
        id: 'PPTC 054',
        label: 'Adult Passport Renewal Application',
        description: 'Primary form for renewing an adult Canadian passport (ages 16+).',
        url: 'https://www.canada.ca/content/dam/ircc/migration/ircc/english/passport/forms/pdf/pptc054.pdf',
        linkType: 'pdf',
      },
      {
        id: 'PPTC 084',
        label: 'Credit Card Payment Authorization',
        description: 'Authorise credit card payment for passport fees (inside Canada and the US).',
        url: 'https://www.canada.ca/content/dam/ircc/documents/pdf/english/kits/forms/pptc084.pdf',
        linkType: 'pdf',
      },
      {
        id: 'PPTC 056',
        label: 'Additional Information – Address and Occupation',
        description: 'Supplementary details if your address or occupation differs from the main form.',
        url: 'https://www.canada.ca/content/dam/ircc/documents/pdf/english/kits/forms/pptc056.pdf',
        linkType: 'pdf',
      },
      {
        id: 'PPTC 203',
        label: 'Declaration – Lost, Stolen or Damaged Passport',
        description: 'Required if your current passport was lost, stolen or damaged.',
        url: 'https://www.canada.ca/content/dam/ircc/documents/pdf/english/kits/forms/pptc203e.pdf',
        linkType: 'pdf',
      },
    ],
    keywords: ['passport', 'travel', 'pptc'],
  },
  {
    id: 'drivers-license',
    title: "Driver's Licence Renewal",
    description: "Renew an expiring driver's licence.",
    icon: 'directions_car',
    available: true,
    requirements: [
      'Government photo ID',
      'Current licence number',
      'Current address details',
      'Vision/medical confirmation (if requested by province)',
    ],
    forms: [
      {
        id: 'ServiceCanada',
        label: "Renew Your Driver's Licence Online",
        description: 'ServiceCanada online renewal — eligible if your address and photo are unchanged.',
        url: 'https://www.Canada.ca/page/renew-drivers-licence',
        linkType: 'web',
      },
      {
        id: 'MTO Form',
        label: 'Address Confirmation / In-Person Visit',
        description: 'Must visit a ServiceCanada centre if your address changed within the last 90 days.',
        url: 'https://www.Canada.ca/locations/serviceCanada',
        linkType: 'web',
      },
    ],
    keywords: ['driver', 'licence', 'license', 'driving', 'car'],
  },
  {
    id: 'health-card',
    title: 'Health Card Renewal',
    description: 'Renew your provincial health card coverage.',
    icon: 'health_and_safety',
    available: true,
    requirements: [
      'Government-issued photo ID',
      'Proof of provincial residency',
      'Current health card number',
    ],
    forms: [
      {
        id: 'ServiceCanada',
        label: 'Renew Your Health Card (OHIP)',
        description: 'Online renewal for eligible Canada residents. Bring two original identity documents.',
        url: 'https://www.Canada.ca/page/health-card-renewal',
        linkType: 'web',
      },
      {
        id: 'HC Document List',
        label: 'Accepted Identity Documents for Health Card',
        description: 'Official list of documents accepted to prove identity and residency.',
        url: 'https://www.Canada.ca/page/documents-needed-get-health-card',
        linkType: 'web',
      },
    ],
    keywords: ['health', 'ohip', 'coverage', 'medical'],
  },
  {
    id: 'sin',
    title: 'SIN Record Update / Renewal',
    description: 'Update or renew SIN records for eligibility checks.',
    icon: 'badge',
    available: true,
    requirements: [
      'Primary identity document',
      'Supporting immigration/citizenship document',
      'Proof of address',
    ],
    forms: [
      {
        id: 'SIN Online',
        label: 'Apply / Update SIN Online (MSCA)',
        description: 'Fastest method — apply or update your SIN via My Service Canada Account.',
        url: 'https://www.canada.ca/en/employment-social-development/services/sin/apply.html',
        linkType: 'web',
      },
      {
        id: 'SIN Docs',
        label: 'Required Documents for SIN Application',
        description: 'Full list of accepted primary and secondary identity documents.',
        url: 'https://www.canada.ca/en/employment-social-development/services/sin/required-documents.html',
        linkType: 'web',
      },
    ],
    keywords: ['sin', 'social insurance', 'benefits', 'work'],
  },
  {
    id: 'address-change',
    title: 'Address Change',
    description: 'Update your address on government records and service files.',
    icon: 'home_pin',
    available: false,
    requirements: [],
    forms: [],
    keywords: ['address', 'move', 'relocation'],
  },
  {
    id: 'birth-certificate',
    title: 'Birth Certificate',
    description: 'Request a new birth certificate or replacement copy.',
    icon: 'description',
    available: false,
    requirements: [],
    forms: [],
    keywords: ['birth', 'certificate', 'vital stats'],
  },
  {
    id: 'pr-card',
    title: 'PR Card',
    description: 'Renew or replace your permanent resident card.',
    icon: 'credit_card',
    available: false,
    requirements: [],
    forms: [],
    keywords: ['pr', 'permanent resident', 'immigration'],
  },
  {
    id: 'name-change',
    title: 'Name Change',
    description: 'Submit forms for legal name change records.',
    icon: 'edit_note',
    available: false,
    requirements: [],
    forms: [],
    keywords: ['name change', 'legal name', 'surname'],
  },
];