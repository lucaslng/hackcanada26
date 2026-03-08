// Step6.tsx

import { useState } from 'react';
import { SectionCard } from '../ui/SectionCard';
import { UploadWidget, type CloudinaryUploadResult } from '../../cloudinary/UploadWidget';
import type { RenewalForm, RenewalOption } from '../../data/renewalOptions';
import type { UIStrings } from '../../constants/i18n';

interface Step6Props {
  t: UIStrings;
  selectedOption: RenewalOption | null;
  requiredUploads: Record<string, CloudinaryUploadResult | null>;
  onRequiredUpload: (requirement: string, result: CloudinaryUploadResult | null) => void;
}

function FormCard({
  form,
  t,
  uploadedFile,
  onRequiredUpload,
}: {
  form: RenewalForm;
  t: UIStrings;
  uploadedFile: CloudinaryUploadResult | null;
  onRequiredUpload: (requirement: string, result: CloudinaryUploadResult | null) => void;
}) {
  const isPDF = form.linkType === 'pdf';
  const icon = isPDF ? 'picture_as_pdf' : 'open_in_new';
  const badge = isPDF ? t.formBadgePdf : t.formBadgeWeb;
  const badgeClass = isPDF ? 'form-badge form-badge--pdf' : 'form-badge form-badge--web';
  const hasUpload = Boolean(uploadedFile);

  return (
    <li className="form-card">
      <div className="form-card__left">
        <span className={`form-card__type-icon material-symbols-outlined ${isPDF ? 'pdf' : 'web'}`} aria-hidden="true">
          {icon}
        </span>
      </div>
      <div className="form-card__body">
        <div className="form-card__top">
          <span className="form-card__id">{form.id}</span>
          <span className={badgeClass}>{badge}</span>
        </div>
        <p className="form-card__label">{form.label}</p>
        {form.description && (
          <p className="form-card__desc">{form.description}</p>
        )}
      </div>
      <div className="form-card__action">
        <div className="form-card__actions">
          {form.url ? (
            <a
              href={form.url}
              target="_blank"
              rel="noopener noreferrer"
              className="form-card__link form-card__btn"
              aria-label={`${isPDF ? t.formActionDownload : t.formActionOpen} ${form.label}`}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                {isPDF ? 'download' : 'open_in_new'}
              </span>
              <span>{isPDF ? t.formDownloadOfficial : t.formOpenOfficialPage}</span>
            </a>
          ) : null}

          <UploadWidget
            onUploadSuccess={(result) => onRequiredUpload(form.id, result)}
            onUploadError={(err) => alert(`${t.formUploadFailedPrefix} ${err.message}`)}
            buttonText={hasUpload ? t.formReplaceUploaded : t.formUploadSigned}
            loadingText={t.uploadWidgetLoading}
            loadErrorText={t.uploadWidgetLoadError}
            className="form-card__btn form-card__btn--primary"
          />

          {uploadedFile && (
            <>
              <a
                href={uploadedFile.secure_url}
                target="_blank"
                rel="noopener noreferrer"
                className="form-card__btn form-card__uploaded-link"
              >
                <span className="material-symbols-outlined" aria-hidden="true">visibility</span>
                <span>{t.formViewUploaded}</span>
              </a>
              <button
                type="button"
                className="form-card__btn form-card__remove-btn"
                onClick={() => onRequiredUpload(form.id, null)}
              >
                <span className="material-symbols-outlined" aria-hidden="true">delete</span>
                <span>{t.formRemoveUpload}</span>
              </button>
              <p className="form-card__upload-meta">
                {t.formUploadedMetaPrefix}: {Math.round(uploadedFile.bytes / 1024)} KB · {uploadedFile.format.toUpperCase()}
              </p>
            </>
          )}
        </div>
      </div>
    </li>
  );
}

export function Step6({ t, selectedOption, requiredUploads, onRequiredUpload }: Step6Props) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pdf' | 'web'>('all');
  const primaryForms = selectedOption?.forms ?? [];
  const filteredForms = primaryForms.filter((form) => activeFilter === 'all' || form.linkType === activeFilter);
  const uploadedCount = primaryForms.filter((form) => Boolean(requiredUploads[form.id])).length;
  const remainingCount = primaryForms.length - uploadedCount;
  const allUploadsComplete = primaryForms.length > 0 && remainingCount === 0;

  const pdfCount = primaryForms.filter((form) => form.linkType === 'pdf').length;
  const webCount = primaryForms.filter((form) => form.linkType === 'web').length;

  return (
    <SectionCard title={t.step6Title} subtitle={t.step6Subtitle} icon="description">
      {primaryForms.length > 0 && (
        <div className="forms-filter-row" role="tablist" aria-label={t.formFiltersAria}>
          <button
            type="button"
            className={activeFilter === 'all' ? 'active' : ''}
            onClick={() => setActiveFilter('all')}
            aria-selected={activeFilter === 'all'}
          >
            {t.formFilterRequired} ({primaryForms.length})
          </button>
          <button
            type="button"
            className={activeFilter === 'pdf' ? 'active' : ''}
            onClick={() => setActiveFilter('pdf')}
            aria-selected={activeFilter === 'pdf'}
          >
            {t.formFilterPdf} ({pdfCount})
          </button>
          <button
            type="button"
            className={activeFilter === 'web' ? 'active' : ''}
            onClick={() => setActiveFilter('web')}
            aria-selected={activeFilter === 'web'}
          >
            {t.formFilterOnline} ({webCount})
          </button>
        </div>
      )}

      {filteredForms.length > 0 ? (
        <>
          <p className={`form-upload-progress ${allUploadsComplete ? 'status-good' : 'status-neutral'}`}>
            {allUploadsComplete
              ? t.formAllUploaded
              : t.formUploadProgress
                  .replace('{uploaded}', String(uploadedCount))
                  .replace('{total}', String(primaryForms.length))
                  .replace('{remaining}', String(remainingCount))}
          </p>
          <ul className="form-card-list" aria-label={t.requiredFormsAria}>
          {filteredForms.map((form) => (
            <FormCard
              key={form.id}
              form={form}
              t={t}
              uploadedFile={requiredUploads[form.id] ?? null}
              onRequiredUpload={onRequiredUpload}
            />
          ))}
          </ul>
        </>
      ) : (
        <p className="status-neutral">{t.noFormsAvailable}</p>
      )}

      <div className="form-gov-notice">
        <span className="material-symbols-outlined" aria-hidden="true">info</span>
        <p>{t.formGovNotice}</p>
      </div>
    </SectionCard>
  );
}
