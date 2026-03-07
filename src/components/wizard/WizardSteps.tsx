// WizardSteps.tsx

import { SectionCard } from '../ui/SectionCard';
import { Button } from '../ui/Button';
import { UploadWidget } from '../../cloudinary/UploadWidget';
import type { CloudinaryUploadResult } from '../../cloudinary/UploadWidget';
import type { RenewalForm, RenewalOption } from '../../data/renewalOptions';
import type { UIStrings } from '../../constants/i18n';

// ─── Shared prop types ────────────────────────────────────────────────────────

interface BaseStepProps {
  t: UIStrings;
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────

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

// ─── Step 2 ───────────────────────────────────────────────────────────────────

interface Step2Props extends BaseStepProps {
  idPhoto: CloudinaryUploadResult | null;
  onUpload: (result: CloudinaryUploadResult) => void;
}

export function Step2({ t, idPhoto, onUpload }: Step2Props) {
  return (
    <SectionCard title={t.step2Title} subtitle={t.step2Subtitle} icon="upload_file">
      <UploadWidget
        onUploadSuccess={onUpload}
        onUploadError={(err) => alert(`ID upload failed: ${err.message}`)}
        buttonText={t.uploadIdBtn}
      />
      {idPhoto && <p className="status-good">{t.uploadIdSuccess}</p>}
    </SectionCard>
  );
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────

interface Step3Props extends BaseStepProps {
  facePhoto: CloudinaryUploadResult | null;
  onUpload: (result: CloudinaryUploadResult) => void;
}

export function Step3({ t, facePhoto, onUpload }: Step3Props) {
  return (
    <SectionCard title={t.step3Title} subtitle={t.step3Subtitle} icon="photo_camera_front">
      <UploadWidget
        onUploadSuccess={onUpload}
        onUploadError={(err) => alert(`Face scan failed: ${err.message}`)}
        buttonText={t.uploadSelfieBtn}
      />
      {facePhoto && <p className="status-good">{t.uploadSelfieSuccess}</p>}
    </SectionCard>
  );
}

// ─── Step 4 ───────────────────────────────────────────────────────────────────

interface Step4Props extends BaseStepProps {
  idPhoto: CloudinaryUploadResult | null;
  facePhoto: CloudinaryUploadResult | null;
  matchScore: number | null;
  onCompare: () => void;
}

export function Step4({ t, idPhoto, facePhoto, matchScore, onCompare }: Step4Props) {
  return (
    <SectionCard title={t.step4Title} subtitle={t.step4Subtitle} icon="person_search">
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

// ─── Step 5 ───────────────────────────────────────────────────────────────────

interface Step5Props extends BaseStepProps {
  selectedOption: RenewalOption | null;
  typedIntent: string;
  mappedForms: RenewalForm[];
  onIntentChange: (value: string) => void;
  onMapForms: () => void;
}

export function Step5({
  t,
  selectedOption,
  typedIntent,
  mappedForms,
  onIntentChange,
  onMapForms,
}: Step5Props) {
  return (
    <SectionCard title={t.step5Title} subtitle={t.step5Subtitle} icon="description">
      <ul className="form-list">
        {selectedOption?.forms.map((form) => (
          <li key={form.id}>
            <span>{form.id}</span>
            <span>{form.label}</span>
          </li>
        ))}
      </ul>
      <div className="ui-stack">
        <label className="ui-label" htmlFor="map-form-input">
          {t.mapFormsLabel}
        </label>
        <input
          id="map-form-input"
          className="ui-input"
          placeholder={t.mapFormsPlaceholder}
          value={typedIntent}
          onChange={(e) => onIntentChange(e.target.value)}
        />
        <Button variant="secondary" onClick={onMapForms}>
          {t.mapRequestBtn}
        </Button>
        {mappedForms.length > 0 && (
          <ul className="form-list">
            {mappedForms.map((form) => (
              <li key={`mapped-${form.id}`}>
                <span>{form.id}</span>
                <span>{form.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SectionCard>
  );
}

// ─── Step 6 ───────────────────────────────────────────────────────────────────

export function Step6({ t }: BaseStepProps) {
  return (
    <SectionCard title={t.step6Title} subtitle={t.step6Subtitle} icon="send">
      <p className="status-neutral">{t.submissionNotice}</p>
    </SectionCard>
  );
}

// ─── Step 7 ───────────────────────────────────────────────────────────────────

interface Step7Props extends BaseStepProps {
  notificationChannel: 'email' | 'sms';
  contactValue: string;
  notificationSaved: boolean;
  onChannelChange: (channel: 'email' | 'sms') => void;
  onContactChange: (value: string) => void;
  onSave: () => void;
}

export function Step7({
  t,
  notificationChannel,
  contactValue,
  notificationSaved,
  onChannelChange,
  onContactChange,
  onSave,
}: Step7Props) {
  return (
    <SectionCard title={t.step7Title} subtitle={t.step7Subtitle} icon="notifications_active">
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