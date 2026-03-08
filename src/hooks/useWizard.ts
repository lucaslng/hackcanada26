// useWizard.ts
import { useState } from 'react';
import type { CloudinaryUploadResult } from '../cloudinary/UploadWidget';
import { RENEWAL_OPTIONS, type RenewalForm, type RenewalOption } from '../data/renewalOptions';
import { getServiceDetailsText, getServiceText, type Language } from '../constants/i18n';

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

export const PROVINCES = ['AB', 'BC', 'MB', 'NB', 'NL', 'NT', 'NS', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'] as const;

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
  requiredUploads: Record<string, CloudinaryUploadResult | null>;
  matchScore: number | null;
  notificationChannel: 'email' | 'sms';
  contactValue: string;
  notificationSaved: boolean;
  canContinue: boolean;
}

export interface WizardActions {
  updateContactField: (field: keyof ContactInfo, value: string) => void;
  setTypedIntent: (value: string) => void;
  setIdPhoto: (result: CloudinaryUploadResult | null) => void;
  setFacePhoto: (result: CloudinaryUploadResult | null) => void;
  setRequiredUpload: (requirement: string, result: CloudinaryUploadResult | null) => void;
  setMatchScore: (score: number) => void;
<<<<<<< HEAD
  completeVerification: (score: number) => void;
=======
  setMatchScoreAndGoNext: (score: number) => void;
>>>>>>> 4001d67 (minor ui & bug fixes)
  setNotificationChannel: (channel: 'email' | 'sms') => void;
  setContactValue: (value: string) => void;
  goNext: () => void;
  goBack: () => void;
  jumpToStep: (targetStep: number) => void;
  mapFormsFromText: (raw: string) => void;
  saveNotifications: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWizard(selectedOptionId: string | null, language: Language) {
  const [step, setStep] = useState(1);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(EMPTY_CONTACT);
  const [typedIntent, setTypedIntent] = useState('');
  const [mappedForms, setMappedForms] = useState<RenewalForm[]>([]);
  const [idPhoto, setIdPhoto] = useState<CloudinaryUploadResult | null>(null);
  const [facePhoto, setFacePhoto] = useState<CloudinaryUploadResult | null>(null);
  const [requiredUploads, setRequiredUploads] = useState<Record<string, CloudinaryUploadResult | null>>({});
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [notificationChannel, setNotificationChannel] = useState<'email' | 'sms'>('email');
  const [contactValue, setContactValue] = useState('');
  const [notificationSaved, setNotificationSaved] = useState(false);

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

  // ── Actions ─────────────────────────────────────────────────────────────────

  const updateContactField = (field: keyof ContactInfo, value: string) => {
    let next = value;
    if (field === 'phone') next = formatPhone(value);
    if (field === 'postalCode') next = normalizePostal(value);
    setContactInfo((prev) => ({ ...prev, [field]: next }));
  };

  const checkCanContinue = () => {
    if (step === 1) return Boolean(selectedOptionId);
    if (step === 2) return true;
    if (step === 3) return Boolean(idPhoto);
    if (step === 4) return Boolean(facePhoto);
    if (step === 5) return matchScore !== null && matchScore >= 82;
    if (step === 6) {
      if (!selectedOption) return false;
      if (selectedOption.forms.length === 0) return true;
      return selectedOption.forms.every((form) => Boolean(requiredUploads[form.id]));
    }
    if (step === 7) return true;
    if (step === 8) return Boolean(contactValue.trim());
    return false;
  };

  const goNext = () => {
    if (step < TOTAL_STEPS && checkCanContinue()) setStep((prev) => prev + 1);
  };

  const goBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  /** Use after step 5 verification so we advance to step 6 without waiting for state to flush. */
  const setMatchScoreAndGoNext = (score: number) => {
    setMatchScore(score);
    setStep((prev) => (prev < TOTAL_STEPS ? prev + 1 : prev));
  };

  const jumpToStep = (targetStep: number) => {
    if (targetStep < 1 || targetStep > TOTAL_STEPS) return;
    if (targetStep >= step) return;
    setStep(targetStep);
  };

  const matchIntentToOption = (raw: string): RenewalOption | null => {
    const text = raw.toLowerCase().trim();
    if (!text) return null;
    return (
      availableOptions.find((o) => {
        const localizedTitle = getServiceText(o.id, language)?.title ?? '';
        const localizedKeywords = getServiceDetailsText(o.id, language)?.keywords ?? [];
        const allKeywords = [...o.keywords, ...localizedKeywords];
        return (
          allKeywords.some((kw) => text.includes(kw.toLowerCase()))
          || text.includes(o.title.toLowerCase())
          || text.includes(localizedTitle.toLowerCase())
        );
      }) ?? null
    );
  };

  const mapFormsFromText = (raw: string) => {
    const option = matchIntentToOption(raw) ?? selectedOption;
    setMappedForms(option ? option.forms : []);
  };

  const setRequiredUpload = (requirement: string, result: CloudinaryUploadResult | null) => {
    setRequiredUploads((prev) => ({ ...prev, [requirement]: result }));
  };

  const completeVerification = (score: number) => {
    setMatchScore(score);
    setStep((prev) => (prev === 5 ? prev + 1 : prev));
  };

  const saveNotifications = () => {
    if (!contactValue.trim()) return;
    setNotificationSaved(true);
  };

  const reset = () => {
    setStep(1);
    setContactInfo(EMPTY_CONTACT);
    setTypedIntent('');
    setMappedForms([]);
    setIdPhoto(null);
    setFacePhoto(null);
    setRequiredUploads({});
    setMatchScore(null);
    setNotificationChannel('email');
    setContactValue('');
    setNotificationSaved(false);
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
    requiredUploads,
    matchScore,
    notificationChannel,
    contactValue,
    notificationSaved,
    canContinue: checkCanContinue(),
  };

  const actions: WizardActions = {
    updateContactField,
    setTypedIntent,
    setIdPhoto,
    setFacePhoto,
    setRequiredUpload,
    setMatchScore,
<<<<<<< HEAD
    completeVerification,
=======
    setMatchScoreAndGoNext,
>>>>>>> 4001d67 (minor ui & bug fixes)
    setNotificationChannel: (ch) => setNotificationChannel(ch),
    setContactValue: (v) => { setContactValue(v); setNotificationSaved(false); },
    goNext,
    goBack,
    jumpToStep,
    mapFormsFromText,
    saveNotifications,
  };

  return { state, actions, reset };
}
