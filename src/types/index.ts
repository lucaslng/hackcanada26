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

export interface Service {
  id: ServiceId;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  processingTime: string;
  description: string;
  docs: RequiredDoc[];
}

export interface UploadedFile {
  docId: string;
  docLabel: string;
  publicId: string;
  secureUrl: string;
}

export type View = 'home' | 'service' | 'confirmation';