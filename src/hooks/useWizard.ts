// useWizard.ts
import { useState } from 'react';
import type { CloudinaryUploadResult } from '../cloudinary/UploadWidget';
import { RENEWAL_OPTIONS, type RenewalForm, type RenewalOption } from '../data/renewalOptions';

export const TOTAL_STEPS = 8;

// ─── Contact ──────────────────────────────────────────────────────────────────

export interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  unit: string;
  city: string;
  province: string;
  postalCode: string;
}

const EMPTY_CONTACT: ContactInfo = {
  fullName: '',
  email: '',
  phone: '',
  streetAddress: '',
  unit: '',
  city: '',
  province: '',
  postalCode: '',
};

export const PROVINCES = [
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'NU', name: 'Nunavut' },
  { code: 'ON', name: 'Canada' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'YT', name: 'Yukon' },
];

// ─── Submission ───────────────────────────────────────────────────────────────

export type SubmitStatus = 'idle' | 'processing' | 'done';

// ─── Public types ─────────────────────────────────────────────────────────────

export interface WizardState {
  step: number;
  selectedOptionId: string | null;
  selectedOption: RenewalOption | null;
  contactInfo: ContactInfo;
  typedIntent: string;
  mappedForms: RenewalForm[];
  idPhoto: CloudinaryUploadResult | null;
  facePhoto: CloudinaryUploadResult | null;
  matchScore: number | null;
  notificationChannel: 'email' | 'sms';
  contactValue: string;
  notificationSaved: boolean;
  canContinue: boolean;
  // Step 7 submission
  submitStatus: SubmitStatus;
  confirmationId: string;
}

export interface WizardActions {
  updateContactField: (field: keyof ContactInfo, value: string) => void;
  setTypedIntent: (value: string) => void;
  setIdPhoto: (result: CloudinaryUploadResult | null) => void;
  setFacePhoto: (result: CloudinaryUploadResult | null) => void;
  setNotificationChannel: (channel: 'email' | 'sms') => void;
  setContactValue: (value: string) => void;
  goNext: () => void;
  goBack: () => void;
  compareFaces: () => void;
  mapFormsFromText: (raw: string) => void;
  saveNotifications: () => void;
  submitApplication: () => void;
}

// ─── Dummy API ────────────────────────────────────────────────────────────────

function generateConfirmationId(): string {
  return (
    'SC-' +
    Math.random().toString(36).slice(2, 6).toUpperCase() +
    '-' +
    Date.now().toString().slice(-4)
  );
}

/**
 * Simulated async submission — resolves after ~5 s of realistic delays.
 * Returns a confirmation ID.
 */
async function dummySubmitApi(): Promise<string> {
  const steps = [700, 1300, 1000, 1200, 600]; // ms per stage
  for (const delay of steps) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  return generateConfirmationId();
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWizard(selectedOptionId: string | null) {
  const [step, setStep] = useState(1);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(EMPTY_CONTACT);
  const [typedIntent, setTypedIntent] = useState('');
  const [mappedForms, setMappedForms] = useState<RenewalForm[]>([]);
  const [idPhoto, setIdPhoto] = useState<CloudinaryUploadResult | null>(null);
  const [facePhoto, setFacePhoto] = useState<CloudinaryUploadResult | null>(null);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [notificationChannel, setNotificationChannel] = useState<'email' | 'sms'>('email');
  const [contactValue, setContactValue] = useState('');
  const [notificationSaved, setNotificationSaved] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [confirmationId, setConfirmationId] = useState('');

  const selectedOption = RENEWAL_OPTIONS.find((o) => o.id === selectedOptionId) ?? null;
  const availableOptions = RENEWAL_OPTIONS.filter((o) => o.available);

  // ── Formatters ──────────────────────────────────────────────────────────────

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const normalizePostal = (value: string) => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    if (cleaned.length <= 3) return cleaned;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  };

  // ── canContinue ─────────────────────────────────────────────────────────────

  const checkCanContinue = () => {
    if (step === 1) return Boolean(selectedOptionId);
    if (step === 2) return true;
    if (step === 3) return Boolean(idPhoto);
    if (step === 4) return Boolean(facePhoto);
    if (step === 5) return Boolean(matchScore && matchScore >= 82);
    if (step === 6) return Boolean(selectedOptionId);
    // Step 7: only allow moving on once submission is complete
    if (step === 7) return submitStatus === 'done';
    if (step === 8) return Boolean(contactValue.trim());
    return false;
  };

  // ── Actions ─────────────────────────────────────────────────────────────────

  const updateContactField = (field: keyof ContactInfo, value: string) => {
    let next = value;
    if (field === 'phone') next = formatPhone(value);
    if (field === 'postalCode') next = normalizePostal(value);
    setContactInfo((prev) => ({ ...prev, [field]: next }));
  };

  const goNext = () => {
    if (step < TOTAL_STEPS && checkCanContinue()) setStep((prev) => prev + 1);
  };

  const goBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const matchIntentToOption = (raw: string): RenewalOption | null => {
    const text = raw.toLowerCase().trim();
    if (!text) return null;
    return (
      availableOptions.find(
        (o) => o.keywords.some((kw) => text.includes(kw)) || text.includes(o.title.toLowerCase()),
      ) ?? null
    );
  };

  const mapFormsFromText = (raw: string) => {
    const option = matchIntentToOption(raw) ?? selectedOption;
    setMappedForms(option ? option.forms : []);
  };

  const compareFaces = () => {
    if (!idPhoto || !facePhoto) return;
    setMatchScore(100);
  };

  const saveNotifications = () => {
    if (!contactValue.trim()) return;
    setNotificationSaved(true);
  };

  /**
   * Kick off the dummy submission.  Called by WizardShell when the user
   * presses "Continue" on step 7.  Ignored if already processing or done.
   */
  const submitApplication = async () => {
    if (submitStatus !== 'idle') return;
    setSubmitStatus('processing');
    try {
      const id = await dummySubmitApi();
      setConfirmationId(id);
      setSubmitStatus('done');
    } catch {
      // In a real app we'd surface the error; here just reset to idle
      setSubmitStatus('idle');
    }
  };

  const reset = () => {
    setStep(1);
    setContactInfo(EMPTY_CONTACT);
    setTypedIntent('');
    setMappedForms([]);
    setIdPhoto(null);
    setFacePhoto(null);
    setMatchScore(null);
    setNotificationChannel('email');
    setContactValue('');
    setNotificationSaved(false);
    setSubmitStatus('idle');
    setConfirmationId('');
  };

  // ── Return ──────────────────────────────────────────────────────────────────

  const state: WizardState = {
    step,
    selectedOptionId,
    selectedOption,
    contactInfo,
    typedIntent,
    mappedForms,
    idPhoto,
    facePhoto,
    matchScore,
    notificationChannel,
    contactValue,
    notificationSaved,
    canContinue: checkCanContinue(),
    submitStatus,
    confirmationId,
  };

  const actions: WizardActions = {
    updateContactField,
    setTypedIntent,
    setIdPhoto,
    setFacePhoto,
    setNotificationChannel: (ch) => setNotificationChannel(ch),
    setContactValue: (v) => {
      setContactValue(v);
      setNotificationSaved(false);
    },
    goNext,
    goBack,
    compareFaces,
    mapFormsFromText,
    saveNotifications,
    submitApplication,
  };

  return { state, actions, reset };
}