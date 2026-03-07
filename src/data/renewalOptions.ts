export interface RenewalForm {
  id: string;
  label: string;
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
      { id: 'pptc-054', label: 'PPTC 054 - Adult Simplified Renewal Application' },
      { id: 'pptc-040', label: 'PPTC 040 - Child General Passport Application' },
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
      { id: 'dl-renew-01', label: "Driver's Licence Renewal Form" },
      { id: 'dl-address-02', label: 'Address Confirmation Form' },
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
      { id: 'hc-renew-01', label: 'Health Coverage Renewal Form' },
      { id: 'hc-res-02', label: 'Residency Confirmation Form' },
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
      { id: 'sin-100', label: 'SIN Update Application Form' },
      { id: 'sin-102', label: 'Supporting Document Declaration' },
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
