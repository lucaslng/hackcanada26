// Step6.tsx

// Step6 — Forms to Print and Sign (overhauled)
// Drop-in replacement for the Step6 export in WizardSteps.tsx.
// Copy this block in place of the existing Step6 function.

import { useState } from 'react';
import { SectionCard } from '../ui/SectionCard';
import type { RenewalForm, RenewalOption } from '../../data/renewalOptions';
import type { UIStrings } from '../../constants/i18n';
import { UploadWidget } from '../../cloudinary/UploadWidget';
import type { CloudinaryUploadResult } from '../../cloudinary/UploadWidget';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;

function buildUploadViewUrl(file: CloudinaryUploadResult): string {
  if (!CLOUD_NAME || !file.public_id) return file.secure_url;
  const hasExt = /\.[a-z0-9]+$/i.test(file.public_id);
  const formatSuffix = !hasExt && file.format ? `.${file.format}` : '';

  if (file.resource_type === 'raw' || file.format?.toLowerCase() === 'pdf') {
    return `https://res.cloudinary.com/${CLOUD_NAME}/raw/upload/${file.public_id}${formatSuffix}`;
  }

  return `https://res.cloudinary.com/${CLOUD_NAME}/${file.resource_type || 'image'}/upload/${file.public_id}${formatSuffix}`;
}

interface Step6Props {
  t: UIStrings;
  selectedOption: RenewalOption | null;
  requiredUploads: Record<string, CloudinaryUploadResult | null>;
  onRequiredUpload: (formId: string, result: CloudinaryUploadResult | null) => void;
}

function FormCard({
  form,
  t,
  uploaded,
  onUpload,
}: {
  form: RenewalForm;
  t: UIStrings;
  uploaded: CloudinaryUploadResult | null;
  onUpload: (result: CloudinaryUploadResult | null) => void;
}) {
  const [opened, setOpened] = useState(false);
  const isPDF = form.linkType === 'pdf';
  const icon = isPDF ? 'picture_as_pdf' : 'open_in_new';
  const badge = isPDF ? t.formBadgePdf : t.formBadgeWeb;
  const badgeClass = isPDF ? 'form-badge form-badge--pdf' : 'form-badge form-badge--web';

  return (
    <li className={`form-card ${uploaded ? 'is-ready' : ''}`}>
      <div className="form-card__left">
        <span className={`form-card__type-icon material-symbols-outlined ${isPDF ? 'pdf' : 'web'}`} aria-hidden="true">
          {icon}
        </span>
      </div>
      <div className="form-card__body">
        <div className="form-card__top">
          <span className="form-card__id">{form.id}</span>
          <span className={badgeClass}>{badge}</span>
          <span className={`s7-required-status ${uploaded ? 'ok' : 'missing'}`}>
            {uploaded ? 'Uploaded' : 'Missing'}
          </span>
        </div>
        <p className="form-card__label">{form.label}</p>
        {form.description && (
          <p className="form-card__desc">{form.description}</p>
        )}
      </div>
      <div className="form-card__action">
        <div className="form-card__actions">
          {form.url ? (
            <>
              <a
                href={form.url}
                target="_blank"
                rel="noopener noreferrer"
                className="form-card__btn form-card__link"
                aria-label={`${isPDF ? t.formActionDownload : t.formActionOpen} ${form.label}`}
                onClick={() => setOpened(true)}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  {isPDF ? 'download' : 'open_in_new'}
                </span>
                <span>{isPDF ? t.formActionDownload : t.formActionOpen}</span>
              </a>
              {opened && <span className="form-opened-tag">Opened</span>}
            </>
          ) : null}
          <UploadWidget
            onUploadSuccess={onUpload}
            onUploadError={(err) => alert(`${t.idUploadFailed} ${err.message}`)}
            buttonText={uploaded ? 'Replace upload' : 'Upload signed form'}
            loadingText={t.uploadWidgetLoading}
            loadErrorText={t.uploadWidgetLoadError}
            className="form-card__btn form-card__btn--primary"
          />
          {uploaded && (
            <a
              className="form-card__btn s7-doc-btn"
              href={buildUploadViewUrl(uploaded)}
              target="_blank"
              rel="noopener noreferrer"
            >
              View upload
            </a>
          )}
        </div>
      </div>
    </li>
  );
}

export function Step6({
  t,
  selectedOption,
  requiredUploads,
  onRequiredUpload,
}: Step6Props) {
  const primaryForms = selectedOption?.forms ?? [];
  const uploadedCount = primaryForms.filter((form) => Boolean(requiredUploads[form.id])).length;

  return (
    <SectionCard title={t.step6Title} subtitle={t.step6Subtitle} icon="description">
      {primaryForms.length > 0 && (
        <div className="ui-banner">
          Signed forms uploaded: <strong>{uploadedCount}/{primaryForms.length}</strong>
        </div>
      )}

      {primaryForms.length > 0 ? (
        <ul className="form-card-list" aria-label={t.requiredFormsAria}>
          {primaryForms.map((form) => (
            <FormCard
              key={form.id}
              form={form}
              t={t}
              uploaded={requiredUploads[form.id] ?? null}
              onUpload={(result) => onRequiredUpload(form.id, result)}
            />
          ))}
        </ul>
      ) : (
        <p className="status-neutral">{t.noFormsAvailable}</p>
      )}

      {primaryForms.length > 0 && (
        <div className="s7-section">
          <div className="s7-section-label">
            <span className="material-symbols-outlined">checklist</span>
            Completed forms ({uploadedCount}/{primaryForms.length})
          </div>
          <div className="s7-required-grid">
            {primaryForms.map((form) => {
              const uploaded = requiredUploads[form.id];
              return (
                <article key={form.id} className={`s7-required-card ${uploaded ? 'is-ready' : 'is-missing'}`}>
                  <div className="s7-required-top">
                    <h4>{form.id}</h4>
                    <span className={`s7-required-status ${uploaded ? 'ok' : 'missing'}`}>{uploaded ? 'Uploaded' : 'Pending'}</span>
                  </div>
                  <p className="form-card__label">{form.label}</p>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Gov disclaimer ── */}
      <div className="form-gov-notice">
        <span className="material-symbols-outlined" aria-hidden="true">info</span>
        <p>
          {t.formGovNotice}
        </p>
      </div>
     </SectionCard>
  );
}
