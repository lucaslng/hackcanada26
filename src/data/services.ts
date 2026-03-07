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
    docs: [
      { id: 'roe', label: 'Record of Employment (ROE)', description: 'Issued by your employer — all ROEs from the past 52 weeks', required: true },
      { id: 'photo-id', label: 'Government-Issued Photo ID', description: "Valid passport, driver's licence, or PR card", required: true },
      { id: 'sin-doc', label: 'Social Insurance Number (SIN)', description: 'SIN card or letter from Service Canada confirming your SIN', required: true },
      { id: 'banking', label: 'Direct Deposit Information', description: 'Void cheque or bank account details for payment', required: false },
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
    docs: [
      { id: 'photo-id', label: 'Government-Issued Photo ID', description: "Passport, driver's licence, or PR card", required: true },
      { id: 'sin-doc', label: 'Social Insurance Number (SIN)', description: 'Required to access your contribution history', required: true },
      { id: 'birth-cert', label: 'Proof of Date of Birth', description: 'Birth certificate, baptismal record, or passport', required: true },
      { id: 'banking', label: 'Direct Deposit Information', description: 'Void cheque for payment processing', required: false },
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
    docs: [
      { id: 'photo-id', label: 'Government-Issued Photo ID', description: "Passport, driver's licence, or PR card", required: true },
      { id: 'birth-cert', label: 'Proof of Age', description: 'Birth certificate or passport showing date of birth', required: true },
      { id: 'residency', label: 'Proof of Canadian Residency', description: 'Documents showing years lived in Canada (tax returns, utility bills)', required: true },
      { id: 'banking', label: 'Direct Deposit Information', description: 'Void cheque or banking details', required: false },
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
      'Apply for a Social Insurance Number (SIN), which you need to work in Canada or to receive government benefits and services. Canadian citizens, permanent residents, and temporary residents may apply.',
    docs: [
      { id: 'primary-id', label: 'Primary Identity Document', description: 'Canadian birth certificate, Canadian passport, or Certificate of Canadian Citizenship', required: true },
      { id: 'immigration', label: 'Immigration Document (if applicable)', description: 'Permanent Resident card, Study/Work permit, or Confirmation of PR', required: false },
      { id: 'address-proof', label: 'Proof of Canadian Address', description: 'Utility bill, bank statement, or government correspondence dated within 12 months', required: true },
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
    docs: [
      { id: 'child-birth-cert', label: "Child's Birth Certificate", description: 'Official provincial/territorial birth certificate for each child', required: true },
      { id: 'parent-id', label: 'Parent/Guardian Photo ID', description: "Passport or driver's licence for the primary caregiver", required: true },
      { id: 'custody', label: 'Custody Documents (if applicable)', description: 'Court order or written agreement if sharing custody', required: false },
      { id: 'residency', label: 'Proof of Residency', description: 'Documents confirming you live in Canada (lease, utility bill)', required: true },
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
    docs: [
      { id: 'citizenship', label: 'Proof of Canadian Citizenship', description: 'Birth certificate or Certificate of Canadian Citizenship (not a passport)', required: true },
      { id: 'photo-id', label: 'Government-Issued Photo ID', description: "Driver's licence or provincial/territorial ID card", required: true },
      { id: 'passport-photos', label: 'Passport Photos (2 copies)', description: 'Two identical 50×70 mm colour photos taken within the last 6 months', required: true },
      { id: 'guarantor', label: 'Guarantor Declaration', description: 'Signed form from a Canadian citizen who has known you for 2+ years', required: true },
      { id: 'old-passport', label: 'Most Recent Passport (if renewing)', description: 'Previous Canadian passport if you are renewing', required: false },
    ],
  },
];