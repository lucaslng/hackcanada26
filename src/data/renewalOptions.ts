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
        url: 'https://www.canada.ca/content/dam/ircc/migration/ircc/english/passport/forms/pdf/pptc084-eng.pdf',
        linkType: 'pdf',
      },
      {
        id: 'PPTC 056',
        label: 'Additional Information – Address and Occupation',
        description: 'Supplementary details if your address or occupation differs from the main form.',
        url: 'https://www.canada.ca/content/dam/ircc/migration/ircc/english/passport/forms/pdf/pptc056-eng.pdf',
        linkType: 'pdf',
      },
      {
        id: 'PPTC 203',
        label: 'Declaration – Lost, Stolen or Damaged Passport',
        description: 'Required if your current passport was lost, stolen or damaged.',
        url: 'https://www.canada.ca/content/dam/ircc/migration/ircc/english/passport/forms/pdf/pptc203-eng.pdf',
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
        id: 'ServiceOntario',
        label: "Renew Your Driver's Licence Online",
        description: 'ServiceOntario online renewal — eligible if your address and photo are unchanged.',
        url: 'https://www.ontario.ca/page/renew-drivers-licence',
        linkType: 'web',
      },
      {
        id: 'MTO Form',
        label: 'Address Confirmation / In-Person Visit',
        description: 'Must visit a ServiceOntario centre if your address changed within the last 90 days.',
        url: 'https://www.ontario.ca/locations/serviceontario',
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
        id: 'ServiceOntario',
        label: 'Renew Your Health Card (OHIP)',
        description: 'Online renewal for eligible Ontario residents. Bring two original identity documents.',
        url: 'https://www.ontario.ca/page/health-card-renewal',
        linkType: 'web',
      },
      {
        id: 'HC Document List',
        label: 'Accepted Identity Documents for Health Card',
        description: 'Official list of documents accepted to prove identity and residency.',
        url: 'https://www.ontario.ca/page/documents-needed-get-health-card',
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
    available: true,
    requirements: [
      'Current government-issued photo ID',
      'New residential and mailing address details',
      'Existing licence/card number (if applicable)',
    ],
    forms: [
      {
        id: 'ServiceOntario',
        label: "Change Address on Driver's Licence and Vehicle Permit",
        description: 'Update your Ontario address online for your driver’s licence and vehicle records.',
        url: 'https://www.ontario.ca/page/change-address-drivers-licence-vehicle-permit-and-health-card',
        linkType: 'web',
      },
      {
        id: 'CRA Address',
        label: 'Change Address with CRA',
        description: 'Update your mailing address for tax and benefit records.',
        url: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/change-your-address.html',
        linkType: 'web',
      },
    ],
    keywords: ['address', 'move', 'relocation', 'change address', 'update address'],
  },
  {
    id: 'birth-certificate',
    title: 'Birth Certificate',
    description: 'Request a new birth certificate or replacement copy.',
    icon: 'description',
    available: true,
    requirements: [
      'Applicant’s full name and date of birth',
      'Place of birth in Ontario (city/town)',
      'Valid payment method and mailing address',
    ],
    forms: [
      {
        id: 'Ontario Vital Statistics',
        label: 'Apply for a Birth Certificate (Ontario)',
        description: 'Official Ontario application service for new, replacement, or certified copies.',
        url: 'https://www.ontario.ca/page/get-or-replace-ontario-birth-certificate',
        linkType: 'web',
      },
      {
        id: 'Status Check',
        label: 'Check Birth Certificate Application Status',
        description: 'Track the progress of your submitted birth certificate request.',
        url: 'https://www.orgforms.gov.on.ca/eForms/start.do?lang=en',
        linkType: 'web',
      },
    ],
    keywords: ['birth', 'certificate', 'vital stats', 'birth record', 'replacement certificate'],
  },
  {
    id: 'pr-card',
    title: 'PR Card',
    description: 'Renew or replace your permanent resident card.',
    icon: 'credit_card',
    available: true,
    requirements: [
      'Current or expired PR card details',
      'Proof of residency in Canada',
      'Digital photo and supporting identity documents',
    ],
    forms: [
      {
        id: 'IMM 5444',
        label: 'Application for a Permanent Resident Card',
        description: 'Primary form to renew or replace a permanent resident card.',
        url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/application-permanent-resident-card.html',
        linkType: 'web',
      },
      {
        id: 'PR Card Guide',
        label: 'PR Card Instruction Guide',
        description: 'Official eligibility rules, document checklist, and submission instructions.',
        url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/guide-5445-applying-permanent-resident-card.html',
        linkType: 'web',
      },
    ],
    keywords: ['pr', 'permanent resident', 'immigration', 'pr card', 'resident card'],
  },
  {
    id: 'name-change',
    title: 'Name Change',
    description: 'Submit forms for legal name change records.',
    icon: 'edit_note',
    available: true,
    requirements: [
      'Proof of identity and current legal name',
      'Supporting reason/documentation for requested change',
      'Guarantor/reference information (if required)',
    ],
    forms: [
      {
        id: 'Ontario Name Change',
        label: 'Apply to Legally Change Your Name (Ontario)',
        description: 'Official process and forms for legal name changes in Ontario.',
        url: 'https://www.ontario.ca/page/change-name',
        linkType: 'web',
      },
      {
        id: 'ServiceOntario Forms',
        label: 'Name Change Forms and Guidance',
        description: 'Program guidance, eligibility, and related ServiceOntario forms.',
        url: 'https://www.ontario.ca/page/official-government-id-and-certificates',
        linkType: 'web',
      },
    ],
    keywords: ['name change', 'legal name', 'surname', 'family name', 'given name'],
  },
];
