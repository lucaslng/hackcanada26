// Step7Submission.tsx

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

// ─── Cloudinary helpers ───────────────────────────────────────────────────────

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;

/**
 * Build a Cloudinary composite URL that layers the selfie as a circular
 * face-cropped portrait on top of the enhanced ID document.
 *
 * URL anatomy:
 *   /image/upload
 *   /{base-transforms}           ← enhance the ID doc canvas
 *   /l_{selfie-id}               ← start the selfie overlay layer
 *   /{selfie-transforms}         ← face-crop + circle + white border
 *   /fl_layer_apply,{position}   ← place the selfie on the base
 *   /{optional VERIFIED text}
 *   /{id-doc-public-id}          ← the base asset
 */
function buildCompositeUrl(
  idPublicId: string,
  selfiePublicId: string,
  matchScore: number | null,
): string {
  // Encode the selfie public ID for use in a Cloudinary overlay:
  // slashes become colons  (samples/face → samples:face)
  const selfieId = selfiePublicId.replace(/\//g, ':');

  const segments: string[] = [
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`,
    // Base: landscape crop + full AI enhancement pipeline
    `c_fill,w_680,h_400,g_auto,e_improve,e_sharpen:40,e_auto_contrast,q_auto,f_jpg`,
    // Selfie layer: face-detect crop → circle → white border
    `l_${selfieId}/c_fill,w_150,h_150,g_face,r_max,bo_4px_solid_white`,
    // Position selfie: top-right corner with padding
    `fl_layer_apply,g_north_east,x_18,y_18`,
  ];

  // "VERIFIED" text badge (bottom-left) when identity check passed
  if (matchScore !== null && matchScore >= 82) {
    segments.push(
      `l_text:arial_14_bold:VERIFIED,co_rgb:22c55e`,
      `fl_layer_apply,g_south_west,x_18,y_14`,
    );
  }

  // SERVICE CANADA wordmark (top-left)
  segments.push(
    `l_text:arial_12:SERVICE+CANADA,co_rgb:ffffff`,
    `fl_layer_apply,g_north_west,x_16,y_16`,
  );

  segments.push(idPublicId);
  return segments.join('/');
}

// ─── ApplicationCompositeCard ─────────────────────────────────────────────────

/**
 * Shows the ID document and selfie combined into a single Cloudinary-generated
 * composite image using the overlay/layer transformation pipeline.
 *
 * If the match score is ≥ 82 the composite also carries a "VERIFIED" badge
 * burned into the image via a Cloudinary text overlay.
 */
function ApplicationCompositeCard({
  idPhoto,
  facePhoto,
  matchScore,
}: {
  idPhoto: CloudinaryUploadResult;
  facePhoto: CloudinaryUploadResult;
  matchScore: number | null;
  t: UIStrings;
}) {
  const [loaded, setLoaded] = useState(false);
  const compositeUrl = buildCompositeUrl(idPhoto.public_id, facePhoto.public_id, matchScore);

  const passed  = matchScore !== null && matchScore >= 82;
  const pending = matchScore === null;

  return (
    <div className="app-composite">
      <div className="app-composite__header">
        <span className="material-symbols-outlined">auto_fix_high</span>
        Cloudinary Application Package — AI-enhanced composite
      </div>

      <div className="app-composite__img-wrap">
        {!loaded && <div className="ins-skeleton" />}
        <img
          src={compositeUrl}
          alt="Application composite: ID document with selfie overlay"
          className="app-composite__img"
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0 }}
        />
      </div>

      <div className="app-composite__footer">
        <span className="app-composite__note">
          <span className="material-symbols-outlined">layers</span>
          ID doc enhanced · selfie face-cropped &amp; composited via Cloudinary overlay pipeline
        </span>

        {pending ? (
          <span className="app-composite__badge app-composite__badge--pending">
            <span className="material-symbols-outlined">schedule</span>
            Verification pending
          </span>
        ) : passed ? (
          <span className="app-composite__badge app-composite__badge--pass">
            <span className="material-symbols-outlined">verified</span>
            {matchScore}% match · Verified
          </span>
        ) : (
          <span className="app-composite__badge app-composite__badge--fail">
            <span className="material-symbols-outlined">warning</span>
            {matchScore}% match · Not verified
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Progress steps ───────────────────────────────────────────────────────────

function ProgressSteps({ active, t }: { active: number; t: UIStrings }) {
  const steps = [
    { icon: 'cloud_upload',    label: t.step7ProgressUpload       },
    { icon: 'auto_fix_high',   label: t.step7ProgressEnhance      },
    { icon: 'verified_user',   label: t.step7ProgressVerify       },
    { icon: 'send',            label: t.step7ProgressSubmit       },
    { icon: 'task_alt',        label: t.step7ProgressConfirmation },
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
  const [submittedAt] = useState(() =>
    new Date().toLocaleString(language, { dateStyle: 'long', timeStyle: 'short' })
  );

  const canSubmit = Boolean(idPhoto && facePhoto && contactInfo.fullName && contactInfo.email);

  const handleSubmit = () => {
    if (!canSubmit || status !== 'idle') return;
    setStatus('processing');
    setProgressStep(0);

    const delays = [800, 1400, 1000, 1200];
    let cumulative = 0;
    delays.forEach((delay, i) => {
      cumulative += delay;
      setTimeout(() => setProgressStep(i + 1), cumulative);
    });
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
          <p className="s7-subtitle">{t.step7ReviewSubtitle}</p>
        </div>
      </div>

      {/* ── Cloudinary Application Composite ── */}
      {idPhoto && facePhoto && (
        <div className="s7-section">
          <div className="s7-section-label">
            <span className="material-symbols-outlined">layers</span>
            {t.step7DocPreviewHeading}
          </div>
          <ApplicationCompositeCard
            idPhoto={idPhoto}
            facePhoto={facePhoto}
            matchScore={matchScore}
            t={t}
          />
          <p className="s7-cloudinary-note">{t.step7CloudinaryEnhanced} · Cloudinary overlay pipeline</p>
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
          <p>{t.step7SuccessBody}</p>
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