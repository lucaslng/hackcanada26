// services.ts

import type { Service } from '../types';

export const SERVICES: Service[] = [
  {
    id: 'employment-insurance',
    title: 'Employment Insurance',
    subtitle: 'EI Benefits',
    icon: '💼',
    color: '#0E4D92',
    processingTime: '28 days',
    description:
      'Apply for Employment Insurance benefits if you have lost your job through no fault of your own, or if you are unable to work due to illness, injury, or pregnancy.',
    idRequirement: "Government-issued photo ID (passport, driver's licence, or PR card) for identity verification.",
    docs: [
      { id: 'roe', label: 'Record of Employment (ROE)', description: 'Issued by your employer — all ROEs from the past 52 weeks', required: true },
      { id: 'sin-doc', label: 'Social Insurance Number (SIN)', description: 'SIN card or letter from Service Canada confirming your SIN', required: true },
      { id: 'banking', label: 'Direct Deposit Information', description: 'Void cheque or bank account details for payment', required: false },
    ],
    forms: [
      {
        id: 'ei-application',
        name: 'Application for Employment Insurance Benefits',
        formNumber: 'INS5257',
        description: 'Main application form to claim EI benefits. Complete all sections.',
        url: 'https://www.canada.ca/en/employment-social-development/services/ei/forms.html',
        required: true,
      },
      {
        id: 'ei-direct-deposit',
        name: 'Direct Deposit Enrolment',
        formNumber: 'PWGSC-TPSGC 3048',
        description: 'Set up direct deposit for faster payment delivery.',
        url: 'https://www.canada.ca/en/public-services-procurement/services/payments-to-from-government/direct-deposit.html',
        required: false,
      },
    ],
  },
  {
    id: 'cpp',
    title: 'Canada Pension Plan',
    subtitle: 'CPP Retirement Pension',
    icon: '🏦',
    color: '#2D6A4F',
    processingTime: '6–12 weeks',
    description:
      'Apply for your CPP retirement pension, disability benefits, or survivor benefits. The amount you receive is based on your contributions and the age you start your pension.',
    idRequirement: "Government-issued photo ID and proof of date of birth for identity verification.",
    docs: [
      { id: 'sin-doc', label: 'Social Insurance Number (SIN)', description: 'Required to access your contribution history', required: true },
      { id: 'birth-cert', label: 'Proof of Date of Birth', description: 'Birth certificate, baptismal record, or passport', required: true },
      { id: 'banking', label: 'Direct Deposit Information', description: 'Void cheque for payment processing', required: false },
    ],
    forms: [
      {
        id: 'cpp-retirement',
        name: 'Application for CPP Retirement Pension',
        formNumber: 'ISP-1000',
        description: 'Primary form to apply for your monthly CPP retirement pension.',
        url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/cpp-benefit/apply.html',
        required: true,
      },
      {
        id: 'cpp-voluntary-tax',
        name: 'Request for Voluntary Federal Income Tax Deductions',
        formNumber: 'ISP-3520',
        description: 'Optional — request voluntary tax deductions from your CPP payments.',
        url: 'https://www.canada.ca/en/employment-social-development/services/ei/forms.html',
        required: false,
      },
    ],
  },
  {
    id: 'old-age-security',
    title: 'Old Age Security',
    subtitle: 'OAS Pension',
    icon: '🌿',
    color: '#6B3FA0',
    processingTime: '6 months',
    description:
      'Old Age Security is a monthly payment available to Canadians 65 years of age and older. You may also apply for the Guaranteed Income Supplement if you have a low income.',
    idRequirement: "Government-issued photo ID and proof of age and residency for identity verification.",
    docs: [
      { id: 'birth-cert', label: 'Proof of Age', description: 'Birth certificate or passport showing date of birth', required: true },
      { id: 'residency', label: 'Proof of Canadian Residency', description: 'Documents showing years lived in Canada (tax returns, utility bills)', required: true },
      { id: 'banking', label: 'Direct Deposit Information', description: 'Void cheque or banking details', required: false },
    ],
    forms: [
      {
        id: 'oas-application',
        name: 'Application for OAS and GIS',
        formNumber: 'ISP-3550',
        description: 'Combined application for Old Age Security pension and Guaranteed Income Supplement.',
        url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/apply.html',
        required: true,
      },
    ],
  },
  {
    id: 'sin',
    title: 'Social Insurance Number',
    subtitle: 'New SIN Application',
    icon: '🪪',
    color: '#B5451B',
    processingTime: '20 business days',
    description:
      'Apply for a Social Insurance Number (SIN), which you need to work in Canada or to receive government benefits and services.',
    idRequirement: "Primary identity document (Canadian birth certificate, passport, or Citizenship Certificate) for identity verification.",
    docs: [
      { id: 'primary-id', label: 'Primary Identity Document', description: 'Canadian birth certificate, Canadian passport, or Certificate of Canadian Citizenship', required: true },
      { id: 'immigration', label: 'Immigration Document (if applicable)', description: 'Permanent Resident card, Study/Work permit, or Confirmation of PR', required: false },
      { id: 'address-proof', label: 'Proof of Canadian Address', description: 'Utility bill, bank statement, or government correspondence dated within 12 months', required: true },
    ],
    forms: [
      {
        id: 'sin-application',
        name: 'Application for a Social Insurance Number',
        formNumber: 'NAS-2120',
        description: 'Complete this form to apply for a new SIN or to request a replacement card.',
        url: 'https://www.canada.ca/en/employment-social-development/services/sin/apply.html',
        required: true,
      },
    ],
  },
  {
    id: 'child-benefit',
    title: 'Canada Child Benefit',
    subtitle: 'CCB Application',
    icon: '👶',
    color: '#C8962A',
    processingTime: '8 weeks',
    description:
      'The Canada Child Benefit is a tax-free monthly payment made to eligible families to help with the cost of raising children under 18 years of age.',
    idRequirement: "Government-issued photo ID for the primary caregiver for identity verification.",
    docs: [
      { id: 'child-birth-cert', label: "Child's Birth Certificate", description: 'Official provincial/territorial birth certificate for each child', required: true },
      { id: 'custody', label: 'Custody Documents (if applicable)', description: 'Court order or written agreement if sharing custody', required: false },
      { id: 'residency', label: 'Proof of Residency', description: 'Documents confirming you live in Canada (lease, utility bill)', required: true },
    ],
    forms: [
      {
        id: 'ccb-application',
        name: 'Canada Child Benefits Application',
        formNumber: 'RC66',
        description: 'Main application form for Canada Child Benefit and related provincial/territorial programs.',
        url: 'https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/rc66.html',
        required: true,
      },
      {
        id: 'ccb-marital-status',
        name: 'Marital Status Change',
        formNumber: 'RC65',
        description: 'Required if your marital status has recently changed.',
        url: 'https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/rc65.html',
        required: false,
      },
    ],
  },
  {
    id: 'passport',
    title: 'Passport Application',
    subtitle: 'Adult & Child Passports',
    icon: '✈️',
    color: '#C8102E',
    processingTime: '10–15 business days',
    description:
      'Apply for a Canadian passport for travel abroad. Adults may apply for a 5-year or 10-year passport. Children under 16 receive a 5-year passport.',
    idRequirement: "Canadian citizenship document and government-issued photo ID for identity verification.",
    docs: [
      { id: 'citizenship', label: 'Proof of Canadian Citizenship', description: 'Birth certificate or Certificate of Canadian Citizenship (not a passport)', required: true },
      { id: 'passport-photos', label: 'Passport Photos (2 copies)', description: 'Two identical 50×70 mm colour photos taken within the last 6 months', required: true },
      { id: 'old-passport', label: 'Most Recent Passport (if renewing)', description: 'Previous Canadian passport if you are renewing', required: false },
    ],
    forms: [
      {
        id: 'passport-adult',
        name: 'Adult Passport Application',
        formNumber: 'PPTC 054',
        description: 'For Canadians 16 years and older applying for a new or renewal passport.',
        url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/apply-who-where.html',
        required: true,
      },
      {
        id: 'passport-guarantor',
        name: 'Guarantor Declaration',
        formNumber: 'PPTC 132',
        description: 'Must be signed by a Canadian citizen who has known you for 2+ years.',
        url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports.html',
        required: true,
      },
      {
        id: 'passport-lost',
        name: 'Declaration Regarding a Lost or Stolen Passport',
        formNumber: 'PPTC 203',
        description: 'Required only if your previous passport was lost or stolen.',
        url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports.html',
        required: false,
      },
    ],
  },
];