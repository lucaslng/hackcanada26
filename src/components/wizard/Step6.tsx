// Step6.tsx

// Step6 — Forms to Print and Sign (overhauled)
// Drop-in replacement for the Step6 export in WizardSteps.tsx.
// Copy this block in place of the existing Step6 function.

import { useState } from 'react';
import { SectionCard } from '../ui/SectionCard';
import type { RenewalForm, RenewalOption } from '../../data/renewalOptions';
import type { UIStrings } from '../../constants/i18n';

interface Step6Props {
  t: UIStrings;
  selectedOption: RenewalOption | null;
}

function FormCard({ form, t }: { form: RenewalForm; t: UIStrings }) {
  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState(false);
  const isPDF = form.linkType === 'pdf';
  const icon = isPDF ? 'picture_as_pdf' : 'open_in_new';
  const badge = isPDF ? t.formBadgePdf : t.formBadgeWeb;
  const badgeClass = isPDF ? 'form-badge form-badge--pdf' : 'form-badge form-badge--web';

  const handleCopyLink = async () => {
    if (!form.url) return;
    try {
      await navigator.clipboard.writeText(form.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

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
        {form.url ? (
          <div className="form-card__actions">
            <a
              href={form.url}
              target="_blank"
              rel="noopener noreferrer"
              className="form-card__link"
              aria-label={`${isPDF ? t.formActionDownload : t.formActionOpen} ${form.label}`}
              onClick={() => setOpened(true)}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                {isPDF ? 'download' : 'open_in_new'}
              </span>
              <span>{isPDF ? t.formActionDownload : t.formActionOpen}</span>
            </a>
            <button type="button" className="form-card__copy-btn" onClick={handleCopyLink}>
              <span className="material-symbols-outlined" aria-hidden="true">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied' : 'Copy link'}</span>
            </button>
            {opened && <span className="form-opened-tag">Opened</span>}
          </div>
        ) : null}
      </div>
    </li>
  );
}

export function Step6({
  t,
  selectedOption,
}: Step6Props) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pdf' | 'web'>('all');
  const primaryForms = selectedOption?.forms ?? [];
  const filteredForms = primaryForms.filter((form) => activeFilter === 'all' || form.linkType === activeFilter);

  const pdfCount = primaryForms.filter((form) => form.linkType === 'pdf').length;
  const webCount = primaryForms.filter((form) => form.linkType === 'web').length;

  return (
    <SectionCard title={t.step6Title} subtitle={t.step6Subtitle} icon="description">
      {primaryForms.length > 0 && (
        <div className="forms-filter-row" role="tablist" aria-label="Form filters">
          <button
            type="button"
            className={activeFilter === 'all' ? 'active' : ''}
            onClick={() => setActiveFilter('all')}
            aria-selected={activeFilter === 'all'}
          >
            Required ({primaryForms.length})
          </button>
          <button
            type="button"
            className={activeFilter === 'pdf' ? 'active' : ''}
            onClick={() => setActiveFilter('pdf')}
            aria-selected={activeFilter === 'pdf'}
          >
            PDF ({pdfCount})
          </button>
          <button
            type="button"
            className={activeFilter === 'web' ? 'active' : ''}
            onClick={() => setActiveFilter('web')}
            aria-selected={activeFilter === 'web'}
          >
            Online ({webCount})
          </button>
        </div>
      )}

      {/* ── Primary forms list ── */}
      {filteredForms.length > 0 ? (
        <ul className="form-card-list" aria-label={t.requiredFormsAria}>
          {filteredForms.map((form) => (
            <FormCard key={form.id} form={form} t={t} />
          ))}
        </ul>
      ) : (
        <p className="status-neutral">{t.noFormsAvailable}</p>
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
