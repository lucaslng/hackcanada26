// index.ts

export type ServiceId =
  | 'employment-insurance'
  | 'cpp'
  | 'old-age-security'
  | 'sin'
  | 'child-benefit'
  | 'passport';

export interface RequiredDoc {
  id: string;
  label: string;
  description: string;
  required: boolean;
}

export interface ServiceForm {
  id: string;
  name: string;
  formNumber: string;
  description: string;
  url: string;
  required: boolean;
}

export interface Service {
  id: ServiceId;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  processingTime: string;
  description: string;
  idRequirement: string;
  docs: RequiredDoc[];
  forms: ServiceForm[];
}

export interface UploadedFile {
  docId: string;
  docLabel: string;
  publicId: string;
  secureUrl: string;
}

export interface CapturedPhoto {
  publicId: string;
  secureUrl: string;
  transformedUrl: string;
}

export interface VerificationResult {
  passed: boolean;
  confidence: number;
  message: string;
}

export type WizardStep =
  | 'requirements'
  | 'id-capture'
  | 'face-scan'
  | 'verification'
  | 'forms'
  | 'submit';

export type View = 'home' | 'service' | 'confirmation';