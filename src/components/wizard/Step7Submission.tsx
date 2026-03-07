// Step7Submission.tsx
// Drop-in replacement for the Step7 export in WizardSteps.tsx
// Shows enhanced Cloudinary previews of uploaded documents + a dummy submission flow.

import { useState } from 'react';
import type { CloudinaryUploadResult } from '../../cloudinary/UploadWidget';
import type { UIStrings } from '../../constants/i18n';
import type { ContactInfo } from '../../hooks/useWizard';
import type { RenewalOption } from '../../data/renewalOptions';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Step7Props {
  t: UIStrings;
  idPhoto: CloudinaryUploadResult | null;
  facePhoto: CloudinaryUploadResult | null;
  contactInfo: ContactInfo;
  selectedOption: RenewalOption | null;
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

function EnhancedDocPreview({ photo, label }: { photo: CloudinaryUploadResult; label: string }) {
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
          Cloudinary enhanced
        </div>
      </div>
      <p className="s7-doc-label">{label}</p>
    </div>
  );
}

function FaceChip({ photo }: { photo: CloudinaryUploadResult }) {
  const [loaded, setLoaded] = useState(false);
  const url = buildFacePreviewUrl(photo.public_id);

  return (
    <div className="s7-face-chip" data-loaded={loaded}>
      {!loaded && <div className="s7-face-skeleton" />}
      <img
        src={url}
        alt="Face verified"
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0 }}
      />
      <span className="s7-face-tick material-symbols-outlined">verified</span>
    </div>
  );
}

function ProgressSteps({ active }: { active: number }) {
  const steps = [
    { icon: 'cloud_upload', label: 'Uploading documents' },
    { icon: 'auto_fix_high', label: 'Enhancing with Cloudinary' },
    { icon: 'verified_user', label: 'Verifying identity' },
    { icon: 'send', label: 'Submitting to ServiceOntario' },
    { icon: 'task_alt', label: 'Confirmation generated' },
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
  idPhoto,
  facePhoto,
  contactInfo,
  selectedOption,
  matchScore,
}: Step7Props) {
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [progressStep, setProgressStep] = useState(0);
  const [confirmationId] = useState(() =>
    'SC-' + Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Date.now().toString().slice(-4)
  );
  const [submittedAt] = useState(() => new Date().toLocaleString('en-CA', {
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
            Review your enhanced documents and submit your pre-service application.
          </p>
        </div>
      </div>

      {/* ── Document previews ── */}
      {(idPhoto || facePhoto) && (
        <div className="s7-section">
          <div className="s7-section-label">
            <span className="material-symbols-outlined">auto_fix_high</span>
            Cloudinary-enhanced document previews
          </div>
          <div className="s7-doc-row">
            {idPhoto && <EnhancedDocPreview photo={idPhoto} label="ID Document" />}
            {facePhoto && (
              <div className="s7-face-col">
                <FaceChip photo={facePhoto} />
                {matchScore !== null && (
                  <span className={`s7-match-badge ${matchScore >= 82 ? 's7-match-badge--pass' : 's7-match-badge--fail'}`}>
                    <span className="material-symbols-outlined">{matchScore >= 82 ? 'verified' : 'warning'}</span>
                    {matchScore}% match
                  </span>
                )}
                <p className="s7-doc-label">Live selfie</p>
              </div>
            )}
          </div>
          <p className="s7-cloudinary-note">
            Images are automatically contrast-corrected, sharpened, and face-cropped by Cloudinary
            before transmission. Original files are not modified.
          </p>
        </div>
      )}

      {/* ── Summary table ── */}
      <div className="s7-section">
        <div className="s7-section-label">
          <span className="material-symbols-outlined">summarize</span>
          Submission summary
        </div>
        <div className="s7-summary-grid">
          <div className="s7-summary-row">
            <span className="s7-summary-key">Service</span>
            <span className="s7-summary-val">{selectedOption?.title ?? '—'}</span>
          </div>
          <div className="s7-summary-row">
            <span className="s7-summary-key">Applicant</span>
            <span className="s7-summary-val">{contactInfo.fullName || '—'}</span>
          </div>
          <div className="s7-summary-row">
            <span className="s7-summary-key">Email</span>
            <span className="s7-summary-val">{contactInfo.email || '—'}</span>
          </div>
          <div className="s7-summary-row">
            <span className="s7-summary-key">Province</span>
            <span className="s7-summary-val">{contactInfo.province || '—'}</span>
          </div>
          <div className="s7-summary-row">
            <span className="s7-summary-key">ID document</span>
            <span className={`s7-summary-val ${idPhoto ? 's7-check' : 's7-miss'}`}>
              {idPhoto ? '✓ Uploaded & enhanced' : '✗ Missing'}
            </span>
          </div>
          <div className="s7-summary-row">
            <span className="s7-summary-key">Selfie</span>
            <span className={`s7-summary-val ${facePhoto ? 's7-check' : 's7-miss'}`}>
              {facePhoto ? '✓ Captured & enhanced' : '✗ Missing'}
            </span>
          </div>
          {matchScore !== null && (
            <div className="s7-summary-row">
              <span className="s7-summary-key">Identity match</span>
              <span className={`s7-summary-val ${matchScore >= 82 ? 's7-check' : 's7-miss'}`}>
                {matchScore >= 82 ? `✓ Verified (${matchScore}%)` : `✗ Failed (${matchScore}%)`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Processing animation ── */}
      {status === 'processing' && (
        <div className="s7-section">
          <ProgressSteps active={progressStep} />
        </div>
      )}

      {/* ── Success state ── */}
      {status === 'done' && (
        <div className="s7-success">
          <div className="s7-success-icon">
            <span className="material-symbols-outlined">task_alt</span>
          </div>
          <h3>Application submitted</h3>
          <p>
            Your pre-service package has been securely transmitted to ServiceOntario.
            Bring your confirmation number to your appointment.
          </p>
          <div className="s7-confirmation-chip">
            <span className="s7-conf-label">Confirmation number</span>
            <strong className="s7-conf-id">{confirmationId}</strong>
            <span className="s7-conf-time">{submittedAt}</span>
          </div>
          <div className="s7-disclaimer">
            <span className="material-symbols-outlined">info</span>
            This is a demonstration — no real data has been submitted to any government system.
          </div>
        </div>
      )}

      {/* ── Submit button ── */}
      {status === 'idle' && (
        <div className="s7-actions">
          {!canSubmit && (
            <p className="s7-warning">
              <span className="material-symbols-outlined">warning</span>
              Complete steps 2–5 before submitting (contact info, ID upload, selfie, verification).
            </p>
          )}
          <button
            className="s7-submit-btn"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            <span className="material-symbols-outlined">send</span>
            Submit pre-service application
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