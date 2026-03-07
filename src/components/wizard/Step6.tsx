// Step6.tsx

// Step6 — Forms to Print and Sign (overhauled)
// Drop-in replacement for the Step6 export in WizardSteps.tsx.
// Copy this block in place of the existing Step6 function.

import { SectionCard } from '../ui/SectionCard';
import type { RenewalForm, RenewalOption } from '../../data/renewalOptions';
import type { UIStrings } from '../../constants/i18n';

interface Step6Props {
  t: UIStrings;
  selectedOption: RenewalOption | null;
}

function FormCard({ form, t }: { form: RenewalForm; t: UIStrings }) {
  const isPDF = form.linkType === 'pdf';
  const icon = isPDF ? 'picture_as_pdf' : 'open_in_new';
  const badge = isPDF ? t.formBadgePdf : t.formBadgeWeb;
  const badgeClass = isPDF ? 'form-badge form-badge--pdf' : 'form-badge form-badge--web';

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
          <a
            href={form.url}
            target="_blank"
            rel="noopener noreferrer"
            className="form-card__link"
            aria-label={`${isPDF ? t.formActionDownload : t.formActionOpen} ${form.label}`}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              {isPDF ? 'download' : 'open_in_new'}
            </span>
            <span>{isPDF ? t.formActionDownload : t.formActionOpen}</span>
          </a>
        ) : null}
      </div>
    </li>
  );
}

export function Step6({
  t,
  selectedOption,
}: Step6Props) {

  const primaryForms = selectedOption?.forms ?? [];

  return (
    <SectionCard title={t.step6Title} subtitle={t.step6Subtitle} icon="description">

      {/* ── Primary forms list ── */}
      {primaryForms.length > 0 ? (
        <ul className="form-card-list" aria-label={t.requiredFormsAria}>
          {primaryForms.map((form) => (
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
