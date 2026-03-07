// WizardSteps.tsx

import { SectionCard } from '../ui/SectionCard';
import { Button } from '../ui/Button';
import { UploadWidget } from '../../cloudinary/UploadWidget';
import type { CloudinaryUploadResult } from '../../cloudinary/UploadWidget';
import type { RenewalOption } from '../../data/renewalOptions';
import type { UIStrings } from '../../constants/i18n';
import type { ContactInfo } from '../../hooks/useWizard';
import { PROVINCES } from '../../hooks/useWizard';

// ─── Shared prop types ────────────────────────────────────────────────────────

interface BaseStepProps {
  t: UIStrings;
}

// ─── Step 1: Requirements ─────────────────────────────────────────────────────

interface Step1Props extends BaseStepProps {
  selectedOption: RenewalOption | null;
  serviceTitle: string;
}

export function Step1({ t, selectedOption, serviceTitle }: Step1Props) {
  return (
    <SectionCard title={t.step1Title} subtitle={t.step1Subtitle} icon="fact_check">
      <div className="ui-banner">
        {t.selectedService}: <strong>{serviceTitle}</strong>
      </div>
      <ul className="checklist">
        {selectedOption?.requirements.map((req) => <li key={req}>{req}</li>)}
        <li>{t.selfieRequirement}</li>
      </ul>
    </SectionCard>
  );
}

// ─── Step 2: Contact Information ──────────────────────────────────────────────

interface Step2Props extends BaseStepProps {
  contactInfo: ContactInfo;
  onFieldChange: (field: keyof ContactInfo, value: string) => void;
}

export function Step2({ t, contactInfo, onFieldChange }: Step2Props) {
  return (
    <SectionCard title={t.step2Title} subtitle={t.step2Subtitle} icon="contact_mail">
      <div className="contact-form-grid">
        <div className="contact-field contact-field--full">
          <label className="ui-label" htmlFor="full-name">{t.fullName}</label>
          <input
            id="full-name"
            className="ui-input"
            value={contactInfo.fullName}
            onChange={(e) => onFieldChange('fullName', e.target.value)}
          />
        </div>

        <div className="contact-field">
          <label className="ui-label" htmlFor="email">{t.emailAddress}</label>
          <input
            id="email"
            type="email"
            className="ui-input"
            value={contactInfo.email}
            onChange={(e) => onFieldChange('email', e.target.value)}
          />
          <p className="field-helper">{t.emailHelper}</p>
        </div>

        <div className="contact-field">
          <label className="ui-label" htmlFor="phone">{t.phoneNumber}</label>
          <input
            id="phone"
            type="tel"
            className="ui-input"
            value={contactInfo.phone}
            onChange={(e) => onFieldChange('phone', e.target.value)}
          />
          <p className="field-helper">{t.phoneHelper}</p>
        </div>

        <div className="contact-field contact-field--full">
          <label className="ui-label" htmlFor="street">{t.streetAddress}</label>
          <input
            id="street"
            className="ui-input"
            value={contactInfo.streetAddress}
            onChange={(e) => onFieldChange('streetAddress', e.target.value)}
          />
        </div>

        <div className="contact-field">
          <label className="ui-label" htmlFor="unit">{t.apartmentUnit}</label>
          <input
            id="unit"
            className="ui-input"
            value={contactInfo.unit}
            onChange={(e) => onFieldChange('unit', e.target.value)}
          />
        </div>

        <div className="contact-field">
          <label className="ui-label" htmlFor="city">{t.city}</label>
          <input
            id="city"
            className="ui-input"
            value={contactInfo.city}
            onChange={(e) => onFieldChange('city', e.target.value)}
          />
        </div>

        <div className="contact-field">
          <label className="ui-label" htmlFor="province">{t.province}</label>
          <select
            id="province"
            className="ui-input"
            value={contactInfo.province}
            onChange={(e) => onFieldChange('province', e.target.value)}
          >
            <option value="">{t.selectProvince}</option>
            {PROVINCES.map((p) => (
              <option key={p.code} value={p.code}>
                {p.code} - {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="contact-field">
          <label className="ui-label" htmlFor="postal">{t.postalCode}</label>
          <input
            id="postal"
            className="ui-input"
            value={contactInfo.postalCode}
            onChange={(e) => onFieldChange('postalCode', e.target.value)}
          />
        </div>
      </div>
      <p className="contact-note">{t.contactInfoNotice}</p>
    </SectionCard>
  );
}

// ─── Step 3: Upload ID ────────────────────────────────────────────────────────

interface Step3Props extends BaseStepProps {
  idPhoto: CloudinaryUploadResult | null;
  onUpload: (result: CloudinaryUploadResult) => void;
}

export function Step3({ t, idPhoto, onUpload }: Step3Props) {
  return (
    <SectionCard title={t.step3Title} subtitle={t.step3Subtitle} icon="upload_file">
      <UploadWidget
        onUploadSuccess={onUpload}
        onUploadError={(err) => alert(`ID upload failed: ${err.message}`)}
        buttonText={t.uploadIdBtn}
      />
      {idPhoto && <p className="status-good">{t.uploadIdSuccess}</p>}
    </SectionCard>
  );
}

// ─── Step 4: Selfie ───────────────────────────────────────────────────────────

interface Step4Props extends BaseStepProps {
  facePhoto: CloudinaryUploadResult | null;
  onUpload: (result: CloudinaryUploadResult) => void;
}

export function Step4({ t, facePhoto, onUpload }: Step4Props) {
  return (
    <SectionCard title={t.step4Title} subtitle={t.step4Subtitle} icon="photo_camera_front">
      <UploadWidget
        onUploadSuccess={onUpload}
        onUploadError={(err) => alert(`Face scan failed: ${err.message}`)}
        buttonText={t.uploadSelfieBtn}
      />
      {facePhoto && <p className="status-good">{t.uploadSelfieSuccess}</p>}
    </SectionCard>
  );
}

// ─── Step 5: Identity Comparison ─────────────────────────────────────────────

interface Step5Props extends BaseStepProps {
  idPhoto: CloudinaryUploadResult | null;
  facePhoto: CloudinaryUploadResult | null;
  matchScore: number | null;
  onCompare: () => void;
}

export function Step5({ t, idPhoto, facePhoto, matchScore, onCompare }: Step5Props) {
  return (
    <SectionCard title={t.step5Title} subtitle={t.step5Subtitle} icon="person_search">
      <div className="ui-stack">
        <Button onClick={onCompare} disabled={!idPhoto || !facePhoto}>
          {t.runVerification}
        </Button>
        {matchScore !== null && (
          <p className={matchScore >= 82 ? 'status-good' : 'status-bad'}>
            Match score: {matchScore}%{' '}
            {matchScore >= 82 ? `(${t.verified})` : `(${t.notVerified})`}
          </p>
        )}
      </div>
    </SectionCard>
  );
}

// ─── Step 8: Notifications ────────────────────────────────────────────────────

interface Step8Props extends BaseStepProps {
  notificationChannel: 'email' | 'sms';
  contactValue: string;
  notificationSaved: boolean;
  onChannelChange: (channel: 'email' | 'sms') => void;
  onContactChange: (value: string) => void;
  onSave: () => void;
}

export function Step8({
  t,
  notificationChannel,
  contactValue,
  notificationSaved,
  onChannelChange,
  onContactChange,
  onSave,
}: Step8Props) {
  return (
    <SectionCard title={t.step8Title} subtitle={t.step8Subtitle} icon="notifications_active">
      <div className="ui-stack">
        <div className="segmented" role="tablist" aria-label="Notification channel">
          <button
            className={notificationChannel === 'email' ? 'active' : ''}
            onClick={() => onChannelChange('email')}
          >
            {t.emailLabel}
          </button>
          <button
            className={notificationChannel === 'sms' ? 'active' : ''}
            onClick={() => onChannelChange('sms')}
          >
            {t.smsLabel}
          </button>
        </div>
        <input
          className="ui-input"
          placeholder={notificationChannel === 'email' ? 'you@example.com' : '+1 416 555 1212'}
          value={contactValue}
          onChange={(e) => onContactChange(e.target.value)}
        />
        <Button onClick={onSave}>{t.savePreference}</Button>
        {notificationSaved && (
          <p className="status-good">
            {t.updatesSent} {notificationChannel.toUpperCase()} {t.to} {contactValue}.
          </p>
        )}
      </div>
    </SectionCard>
  );
}