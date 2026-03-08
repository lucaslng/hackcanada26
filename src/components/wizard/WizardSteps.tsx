// WizardSteps.tsx

import { SectionCard } from '../ui/SectionCard';
import { Button } from '../ui/Button';
import { UploadWidget } from '../../cloudinary/UploadWidget';
import { DocumentInsightsPanel } from '../../cloudinary/DocumentInsightsPanel';
import type { CloudinaryUploadResult } from '../../cloudinary/UploadWidget';
import type { RenewalOption } from '../../data/renewalOptions';
import { getProvinceName, getServiceDetailsText, type Language, type UIStrings } from '../../constants/i18n';
import type { ContactInfo } from '../../hooks/useWizard';
import { PROVINCES } from '../../hooks/useWizard';

// ─── Shared prop types ────────────────────────────────────────────────────────

interface BaseStepProps {
  t: UIStrings;
}

// ─── Step 1: Requirements ─────────────────────────────────────────────────────

interface Step1Props extends BaseStepProps {
  language: Language;
  selectedOption: RenewalOption | null;
  serviceTitle: string;
}

export function Step1({ t, language, selectedOption, serviceTitle }: Step1Props) {
  const requirements = selectedOption
    ? (getServiceDetailsText(selectedOption.id, language)?.requirements ?? selectedOption.requirements)
    : [];

  return (
    <SectionCard title={t.step1Title} subtitle={t.step1Subtitle} icon="fact_check">
      <div className="ui-banner">
        {t.selectedService}: <strong>{serviceTitle}</strong>
      </div>
      <ul className="checklist">
        {requirements.map((req) => <li key={req}>{req}</li>)}
        <li>{t.selfieRequirement}</li>
      </ul>
    </SectionCard>
  );
}

// ─── Step 2: Contact Information ──────────────────────────────────────────────

interface Step2Props extends BaseStepProps {
  language: Language;
  contactInfo: ContactInfo;
  onFieldChange: (field: keyof ContactInfo, value: string) => void;
}

export function Step2({ t, language, contactInfo, onFieldChange }: Step2Props) {
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_RE = /^\(\d{3}\)\s\d{3}-\d{4}$/;
  const POSTAL_RE = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/;

  const fieldStatus = {
    email: contactInfo.email.length === 0 ? 'neutral' : EMAIL_RE.test(contactInfo.email) ? 'valid' : 'error',
    phone: contactInfo.phone.length === 0 ? 'neutral' : PHONE_RE.test(contactInfo.phone) ? 'valid' : 'error',
    postalCode: contactInfo.postalCode.length === 0 ? 'neutral' : POSTAL_RE.test(contactInfo.postalCode) ? 'valid' : 'error',
  } as const;

  const getFieldClass = (status: 'neutral' | 'valid' | 'error') =>
    `ui-input ${status === 'valid' ? 'is-valid' : status === 'error' ? 'is-error' : ''}`.trim();

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
            className={getFieldClass(fieldStatus.email)}
            placeholder={t.emailPlaceholder}
            value={contactInfo.email}
            onChange={(e) => onFieldChange('email', e.target.value)}
          />
          <p className={`field-helper ${fieldStatus.email === 'error' ? 'field-helper--error' : fieldStatus.email === 'valid' ? 'field-helper--good' : ''}`}>
            {fieldStatus.email === 'error' ? t.invalidEmail : t.emailHelper}
          </p>
        </div>

        <div className="contact-field">
          <label className="ui-label" htmlFor="phone">{t.phoneNumber}</label>
          <input
            id="phone"
            type="tel"
            className={getFieldClass(fieldStatus.phone)}
            placeholder="(416) 555-1212"
            value={contactInfo.phone}
            onChange={(e) => onFieldChange('phone', e.target.value)}
          />
          <p className={`field-helper ${fieldStatus.phone === 'error' ? 'field-helper--error' : fieldStatus.phone === 'valid' ? 'field-helper--good' : ''}`}>
            {fieldStatus.phone === 'error' ? t.invalidPhone : t.phoneHelper}
          </p>
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
            {PROVINCES.map((code) => (
              <option key={code} value={code}>
                {code} - {getProvinceName(code, language)}
              </option>
            ))}
          </select>
        </div>

        <div className="contact-field">
          <label className="ui-label" htmlFor="postal">{t.postalCode}</label>
          <input
            id="postal"
            className={getFieldClass(fieldStatus.postalCode)}
            placeholder="A1A 1A1"
            value={contactInfo.postalCode}
            onChange={(e) => onFieldChange('postalCode', e.target.value)}
          />
          {fieldStatus.postalCode === 'error' && <p className="field-helper field-helper--error">{t.invalidPostal}</p>}
        </div>
      </div>
      <p className="contact-note">{t.contactInfoNotice}</p>
    </SectionCard>
  );
}

// ─── Step 3: Upload ID ────────────────────────────────────────────────────────

interface Step3Props extends BaseStepProps {
  idPhoto: CloudinaryUploadResult | null;
  onUpload: (result: CloudinaryUploadResult | null) => void;
}

export function Step3({ t, idPhoto, onUpload }: Step3Props) {
  return (
    <SectionCard title={t.step3Title} subtitle={t.step3Subtitle} icon="upload_file">
      <div className="upload-zone">
        <p className="upload-zone__hint">Drag and drop supported via picker.</p>
        <UploadWidget
          onUploadSuccess={onUpload}
          onUploadError={(err) => alert(`${t.idUploadFailed} ${err.message}`)}
          buttonText={idPhoto ? 'Replace ID Document' : t.uploadIdBtn}
          loadingText={t.uploadWidgetLoading}
          loadErrorText={t.uploadWidgetLoadError}
        />
      </div>

      {idPhoto && (
        <>
          <div className="upload-preview-card">
            <img src={idPhoto.secure_url} alt={t.step7SummaryIdDocument} />
            <div>
              <p>{t.uploadIdSuccess}</p>
              <p>{Math.round(idPhoto.bytes / 1024)} KB · {idPhoto.format.toUpperCase()}</p>
            </div>
            <button type="button" className="upload-remove-btn" onClick={() => onUpload(null)}>
              Remove
            </button>
          </div>

          {/* Cloudinary Document Intelligence Panel */}
          <DocumentInsightsPanel photo={idPhoto} label="ID Document" />
        </>
      )}
    </SectionCard>
  );
}

// ─── Step 4: Selfie ───────────────────────────────────────────────────────────

interface Step4Props extends BaseStepProps {
  facePhoto: CloudinaryUploadResult | null;
  onUpload: (result: CloudinaryUploadResult | null) => void;
}

export function Step4({ t, facePhoto, onUpload }: Step4Props) {
  return (
    <SectionCard title={t.step4Title} subtitle={t.step4Subtitle} icon="photo_camera_front">
      <div className="upload-zone">
        <p className="upload-zone__hint">Capture or upload from local storage.</p>
        <UploadWidget
          onUploadSuccess={onUpload}
          onUploadError={(err) => alert(`${t.selfieUploadFailed} ${err.message}`)}
          buttonText={facePhoto ? 'Replace Selfie' : t.uploadSelfieBtn}
          loadingText={t.uploadWidgetLoading}
          loadErrorText={t.uploadWidgetLoadError}
        />
      </div>

      {facePhoto && (
        <>
          <div className="upload-preview-card upload-preview-card--selfie">
            <img src={facePhoto.secure_url} alt={t.step7SummarySelfie} />
            <div>
              <p>{t.uploadSelfieSuccess}</p>
              <p>{Math.round(facePhoto.bytes / 1024)} KB · {facePhoto.format.toUpperCase()}</p>
            </div>
            <button type="button" className="upload-remove-btn" onClick={() => onUpload(null)}>
              Remove
            </button>
          </div>

          {/* Cloudinary Document Intelligence Panel */}
          <DocumentInsightsPanel photo={facePhoto} label="Selfie" />
        </>
      )}
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
  const matchBand = matchScore === null ? 'pending' : matchScore >= 90 ? 'high' : matchScore >= 82 ? 'medium' : 'low';
  return (
    <SectionCard title={t.step5Title} subtitle={t.step5Subtitle} icon="person_search">
      <div className="ui-stack">
        <div className="verify-preview-row">
          <div className="verify-preview-card">
            <p>{t.step7SummaryIdDocument}</p>
            {idPhoto ? <img src={idPhoto.secure_url} alt={t.step7SummaryIdDocument} /> : <div className="verify-empty">Missing</div>}
          </div>
          <div className="verify-preview-card">
            <p>{t.step7SummarySelfie}</p>
            {facePhoto ? <img src={facePhoto.secure_url} alt={t.step7SummarySelfie} /> : <div className="verify-empty">Missing</div>}
          </div>
        </div>
        <Button onClick={onCompare} disabled={!idPhoto || !facePhoto}>
          {t.runVerification}
        </Button>
        {matchScore !== null && (
          <div className={`verify-meter verify-meter--${matchBand}`}>
            <div className="verify-meter__top">
              <span>{t.matchScoreLabel}</span>
              <strong>{matchScore}%</strong>
            </div>
            <div className="verify-meter__track">
              <div style={{ width: `${matchScore}%` }} />
            </div>
            <p className={matchScore >= 82 ? 'status-good' : 'status-bad'}>
              {matchScore >= 82 ? t.verified : t.notVerified}
            </p>
          </div>
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
        <div className="segmented" role="tablist" aria-label={t.notificationChannelAria}>
          <button
            role="tab"
            type="button"
            className={notificationChannel === 'email' ? 'active' : ''}
            onClick={() => onChannelChange('email')}
            aria-selected={notificationChannel === 'email'}
          >
            {t.emailLabel}
          </button>
          <button
            role="tab"
            type="button"
            className={notificationChannel === 'sms' ? 'active' : ''}
            onClick={() => onChannelChange('sms')}
            aria-selected={notificationChannel === 'sms'}
          >
            {t.smsLabel}
          </button>
        </div>
        <input
          className="ui-input"
          placeholder={notificationChannel === 'email' ? t.emailPlaceholder : t.smsPlaceholder}
          value={contactValue}
          onChange={(e) => onContactChange(e.target.value)}
        />
        <Button onClick={onSave}>{t.savePreference}</Button>
        {notificationSaved && (
          <div className="notice-toast notice-toast--success" role="status" aria-live="polite">
            <span className="material-symbols-outlined">task_alt</span>
            <p>{t.updatesSent} {notificationChannel === 'email' ? t.emailLabel : t.smsLabel} {t.to} {contactValue}.</p>
          </div>
        )}
      </div>
    </SectionCard>
  );
}