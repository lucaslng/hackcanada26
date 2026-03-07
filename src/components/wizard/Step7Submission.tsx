// Step7Submission.tsx
// Drop-in replacement for the Step7 export in WizardSteps.tsx
// Shows enhanced Cloudinary previews of uploaded documents + a dummy submission flow.

import { useState } from 'react';
import type { CloudinaryUploadResult } from '../../cloudinary/UploadWidget';
import { getServiceText, type Language, type UIStrings } from '../../constants/i18n';
import type { ContactInfo } from '../../hooks/useWizard';
import type { RenewalOption } from '../../data/renewalOptions';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Step7Props {
  t: UIStrings;
  language: Language;
  idPhoto: CloudinaryUploadResult | null;
  facePhoto: CloudinaryUploadResult | null;
  contactInfo: ContactInfo;
  selectedOption: RenewalOption | null;
  serviceTitle: string;
  matchScore: number | null;
}

type SubmitStatus = 'idle' | 'processing' | 'done';

// ─── Cloudinary enhancement helper ───────────────────────────────────────────

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;

/**
 * Build an "enhanced document" URL — auto-contrast, sharpen, trim,
 * restricted to a thumbnail size. Safe to show as a preview.
 */
function buildDocPreviewUrl(publicId: string): string {
  return (
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/` +
    `c_fill,w_280,h_176,g_auto,e_improve,e_sharpen:50,q_auto,f_jpg/` +
    publicId
  );
}

/**
 * Build an "enhanced face" URL — crop to face, normalise lighting.
 */
function buildFacePreviewUrl(publicId: string): string {
  return (
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/` +
    `c_fill,w_120,h_120,g_face,e_improve,e_sharpen:40,q_auto,f_jpg,r_max/` +
    publicId
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function EnhancedDocPreview({ photo, label, t }: { photo: CloudinaryUploadResult; label: string; t: UIStrings }) {
  const [loaded, setLoaded] = useState(false);
  const url = buildDocPreviewUrl(photo.public_id);

  return (
    <div className="s7-doc-preview">
      <div className="s7-doc-img-wrap" data-loaded={loaded}>
        {!loaded && <div className="s7-doc-skeleton" />}
        <img
          src={url}
          alt={`Enhanced ${label}`}
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0 }}
        />
        <div className="s7-doc-badge">
          <span className="material-symbols-outlined">auto_fix_high</span>
          {t.step7CloudinaryEnhanced}
        </div>
      </div>
      <p className="s7-doc-label">{label}</p>
    </div>
  );
}

function FaceChip({ photo, t }: { photo: CloudinaryUploadResult; t: UIStrings }) {
  const [loaded, setLoaded] = useState(false);
  const url = buildFacePreviewUrl(photo.public_id);

  return (
    <div className="s7-face-chip" data-loaded={loaded}>
      {!loaded && <div className="s7-face-skeleton" />}
      <img
        src={url}
        alt={t.step7FaceVerifiedAlt}
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0 }}
      />
      <span className="s7-face-tick material-symbols-outlined">verified</span>
    </div>
  );
}

function ProgressSteps({ active, t }: { active: number; t: UIStrings }) {
  const steps = [
    { icon: 'cloud_upload', label: t.step7ProgressUpload },
    { icon: 'auto_fix_high', label: t.step7ProgressEnhance },
    { icon: 'verified_user', label: t.step7ProgressVerify },
    { icon: 'send', label: t.step7ProgressSubmit },
    { icon: 'task_alt', label: t.step7ProgressConfirmation },
  ];

  return (
    <div className="s7-progress-steps">
      {steps.map((s, i) => {
        const state = i < active ? 'done' : i === active ? 'active' : 'pending';
        return (
          <div key={i} className={`s7-pstep s7-pstep--${state}`}>
            <div className="s7-pstep-icon">
              {state === 'done'
                ? <span className="material-symbols-outlined">check_circle</span>
                : <span className={`material-symbols-outlined ${state === 'active' ? 's7-spin' : ''}`}>
                    {state === 'active' ? 'autorenew' : s.icon}
                  </span>
              }
            </div>
            <span className="s7-pstep-label">{s.label}</span>
            {i < steps.length - 1 && <div className="s7-pstep-line" />}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Step7 ───────────────────────────────────────────────────────────────

export function Step7({
  t,
  language,
  idPhoto,
  facePhoto,
  contactInfo,
  selectedOption,
  serviceTitle,
  matchScore,
}: Step7Props) {
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [progressStep, setProgressStep] = useState(0);
  const [confirmationId] = useState(() =>
    'SC-' + Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Date.now().toString().slice(-4)
  );
  const [submittedAt] = useState(() => new Date().toLocaleString(language, {
    dateStyle: 'long', timeStyle: 'short',
  }));

  const canSubmit = Boolean(idPhoto && facePhoto && contactInfo.fullName && contactInfo.email);

  const handleSubmit = () => {
    if (!canSubmit || status !== 'idle') return;
    setStatus('processing');
    setProgressStep(0);

    // Animate through steps
    const delays = [800, 1400, 1000, 1200];
    let cumulative = 0;
    delays.forEach((delay, i) => {
      cumulative += delay;
      setTimeout(() => setProgressStep(i + 1), cumulative);
    });

    // Finish
    setTimeout(() => setStatus('done'), cumulative + 600);
  };

  return (
    <div className="s7-wrap">
      {/* ── Header ── */}
      <div className="s7-header">
        <div className="s7-header-icon">
          <span className="material-symbols-outlined">send</span>
        </div>
        <div>
          <h2>{t.step7Title}</h2>
          <p className="s7-subtitle">
            {t.step7ReviewSubtitle}
          </p>
        </div>
      </div>

      {/* ── Document previews ── */}
      {(idPhoto || facePhoto) && (
        <div className="s7-section">
          <div className="s7-section-label">
            <span className="material-symbols-outlined">auto_fix_high</span>
            {t.step7DocPreviewHeading}
          </div>
          <div className="s7-doc-row">
            {idPhoto && <EnhancedDocPreview photo={idPhoto} label={t.step7SummaryIdDocument} t={t} />}
            {facePhoto && (
              <div className="s7-face-col">
                <FaceChip photo={facePhoto} t={t} />
                {matchScore !== null && (
                  <span className={`s7-match-badge ${matchScore >= 82 ? 's7-match-badge--pass' : 's7-match-badge--fail'}`}>
                    <span className="material-symbols-outlined">{matchScore >= 82 ? 'verified' : 'warning'}</span>
                    {matchScore}% {t.matchScoreLabel}
                  </span>
                )}
                <p className="s7-doc-label">{t.step7SummarySelfie}</p>
              </div>
            )}
          </div>
          <p className="s7-cloudinary-note">
            {t.step7CloudinaryEnhanced}
          </p>
        </div>
      )}

      {/* ── Summary groups ── */}
      <div className="s7-section">
        <div className="s7-section-label">
          <span className="material-symbols-outlined">summarize</span>
          {t.step7SummaryHeading}
        </div>
        <div className="s7-summary-groups">
          <article className="s7-summary-card">
            <h4>Applicant</h4>
            <p><strong>{t.step7SummaryApplicant}:</strong> {contactInfo.fullName || '-'}</p>
            <p><strong>{t.emailAddress}:</strong> {contactInfo.email || '-'}</p>
            <p><strong>{t.province}:</strong> {contactInfo.province || '-'}</p>
          </article>
          <article className="s7-summary-card">
            <h4>Service</h4>
            <p>{selectedOption ? (getServiceText(selectedOption.id, language)?.title ?? serviceTitle) : '-'}</p>
          </article>
          <article className="s7-summary-card">
            <h4>Documents</h4>
            <p className={idPhoto ? 's7-check' : 's7-miss'}>
              {idPhoto ? `✓ ${t.step7SummaryUploadedEnhanced}` : `✗ ${t.step7SummaryMissing}`} ({t.step7SummaryIdDocument})
            </p>
            <p className={facePhoto ? 's7-check' : 's7-miss'}>
              {facePhoto ? `✓ ${t.step7SummaryCapturedEnhanced}` : `✗ ${t.step7SummaryMissing}`} ({t.step7SummarySelfie})
            </p>
          </article>
          <article className="s7-summary-card">
            <h4>Verification</h4>
            {matchScore === null ? (
              <p className="s7-miss">{t.step7SummaryMissing}</p>
            ) : (
              <p className={matchScore >= 82 ? 's7-check' : 's7-miss'}>
                {matchScore >= 82 ? `✓ ${t.verified}` : `✗ ${t.notVerified}`} ({matchScore}%)
              </p>
            )}
          </article>
        </div>
      </div>

      {/* ── Processing animation ── */}
      {status === 'processing' && (
        <div className="s7-section">
          <ProgressSteps active={progressStep} t={t} />
        </div>
      )}

      {/* ── Success state ── */}
      {status === 'done' && (
        <div className="s7-success">
          <div className="s7-success-icon">
            <span className="material-symbols-outlined">task_alt</span>
          </div>
          <h3>{t.step7SuccessTitle}</h3>
          <p>
            {t.step7SuccessBody}
          </p>
          <div className="s7-confirmation-chip">
            <span className="s7-conf-label">{t.step7ConfirmationNumber}</span>
            <strong className="s7-conf-id">{confirmationId}</strong>
            <span className="s7-conf-time">{submittedAt}</span>
          </div>
          <ol className="s7-next-steps">
            <li>Save your confirmation number.</li>
            <li>Bring original documents to your in-person appointment.</li>
            <li>Watch for status updates in your selected channel.</li>
          </ol>
          <div className="s7-disclaimer">
            <span className="material-symbols-outlined">info</span>
            {t.step7DemoNotice}
          </div>
        </div>
      )}

      {/* ── Submit button ── */}
      {status === 'idle' && (
        <div className="s7-actions">
          {!canSubmit && (
            <p className="s7-warning">
              <span className="material-symbols-outlined">warning</span>
              {t.step7IncompleteWarning}
            </p>
          )}
          <button
            className="s7-submit-btn"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            <span className="material-symbols-outlined">send</span>
            {t.step7SubmitButton}
          </button>
          <p className="s7-disclaimer">
            <span className="material-symbols-outlined">info</span>
            {t.submissionNotice}
          </p>
        </div>
      )}
    </div>
  );
}
