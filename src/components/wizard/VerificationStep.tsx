// VerificationStep.tsx

import type { CapturedPhoto, VerificationResult } from '../../types';
import { useFaceVerification } from '../../hooks/useFaceVerification';
import type { UIStrings } from '../../constants/i18n';

interface VerificationStepProps {
  t: UIStrings;
  idPhoto: CapturedPhoto;
  selfiePhoto: CapturedPhoto;
  serviceColor: string;
  onNext: (result: VerificationResult) => void;
  onBack: () => void;
}

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;

export function VerificationStep({
  t,
  idPhoto,
  selfiePhoto,
  serviceColor,
  onNext,
  onBack,
}: VerificationStepProps) {
  const { result, verify, reset } = useFaceVerification(CLOUD_NAME);
  const STATUS_LABELS: Record<string, string> = {
    analyzing: t.step7ProgressEnhance,
  };
  const ANALYSIS_STEPS = [
    t.step7ProgressEnhance,
    t.step7ProgressVerify,
    t.step7ProgressUpload,
    t.step7ProgressConfirmation,
  ];

  const isAnalyzing = result.status === 'analyzing';
  const isDone = result.status === 'done';
  const isError = result.status === 'error';

  // Map status → which step bullet is "active" in the animated list
  const activeStep =
    result.status === 'analyzing' ? 1
        : isDone ? ANALYSIS_STEPS.length
          : 0;

  const handleRun = () => {
    verify(idPhoto.publicId, selfiePhoto.publicId);
  };

  const handleRetry = () => {
    reset();
  };

  const handleContinue = () => {
    if (!result.passed || result.similarity === null) return;
    onNext({
      passed: true,
      confidence: result.similarity,
      message: result.message,
    });
  };

  const confidenceColor =
    result.passed ? '#16a34a' : '#dc2626';

  return (
    <div className="wizard-step-content verification-step">
      <div className="step-header">
        <div
          className="step-icon-circle"
          style={{ background: `color-mix(in srgb, ${serviceColor} 12%, var(--surface))`, color: serviceColor }}
        >
          VR
        </div>
        <h2>{t.verifyIdentity}</h2>
        <p>
          {t.verifyIdentityBody}
        </p>
      </div>

      <div className="verification-layout">

        {/* ── Photo comparison row ── */}
        <div className="photo-compare-row">
          <div className="compare-photo-card">
            <div className="compare-photo-label">{t.step7SummaryIdDocument}</div>
            <div className="compare-photo-frame" style={{ borderColor: serviceColor }}>
              <img
                src={idPhoto.transformedUrl}
                alt={t.step7SummaryIdDocument}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div className="compare-photo-tag">{t.step7CloudinaryEnhanced}</div>
          </div>

          <div
            className={`compare-vs-badge ${isAnalyzing ? 'pulsing' : ''}`}
            style={
              isDone && result.passed ? { color: '#16a34a' }
                : isDone && !result.passed ? { color: '#dc2626' }
                  : { color: serviceColor }
            }
          >
            {isDone && result.passed ? '✓' : isDone && !result.passed ? '✗' : isAnalyzing ? '⟳' : 'VS'}
          </div>

          <div className="compare-photo-card">
            <div className="compare-photo-label">{t.step7SummarySelfie}</div>
            <div className="compare-photo-frame" style={{ borderColor: serviceColor }}>
              <img
                src={selfiePhoto.transformedUrl}
                alt={t.step7SummarySelfie}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div className="compare-photo-tag">{t.step7CloudinaryEnhanced}</div>
          </div>
        </div>

        {/* ── Idle: prompt to start ── */}
        {result.status === 'idle' && (
          <div className="verify-idle-panel">
            <p className="verify-idle-desc">
              {t.step7ReviewSubtitle}
            </p>
            <button
              className="btn-step-primary"
              style={{ background: serviceColor }}
              onClick={handleRun}
            >
              {t.runVerification}
            </button>
          </div>
        )}

        {/* ── Analyzing ── */}
        {isAnalyzing && (
          <div className="analyzing-panel">
            <div className="analyzing-header">
              <div className="analyzing-spinner" style={{ borderTopColor: serviceColor }} />
              <strong>
                {STATUS_LABELS[result.status] ?? 'Analysing…'}
              </strong>
            </div>
            <div className="analysis-steps-list">
              {ANALYSIS_STEPS.map((label, i) => (
                <div
                  key={i}
                  className={`analysis-step-row ${i < activeStep ? 'done' : ''} ${i === activeStep ? 'active' : ''}`}
                >
                  <span
                    className="analysis-step-indicator"
                    style={
                      i < activeStep ? { color: '#16a34a' }
                        : i === activeStep ? { color: serviceColor }
                          : {}
                    }
                  >
                    {i < activeStep ? '✓' : i === activeStep ? '⟳' : '○'}
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Pass ── */}
        {isDone && result.passed && result.similarity !== null && (
          <div className="result-panel result-panel--pass">
            <div className="result-icon result-icon--pass">✓</div>
            <h3>{t.verified}</h3>
            <p className="result-message">{result.message}</p>

            <div className="confidence-meter">
              <div className="confidence-label">
                <span>{t.matchScoreLabel}</span>
                <strong style={{ color: confidenceColor }}>{result.similarity}%</strong>
              </div>
              <div className="confidence-bar-bg">
                <div
                  className="confidence-bar-fill"
                  style={{ width: `${result.similarity}%`, background: confidenceColor }}
                />
              </div>
            </div>

            {result.score !== null && (
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Resemble score: <strong>{result.score}</strong>
                &nbsp;(threshold&nbsp;≥&nbsp;0.62)
              </p>
            )}

            <button
              className="btn-step-primary"
              style={{ background: serviceColor, marginTop: '0.5rem' }}
              onClick={handleContinue}
            >
              {t.continue}
            </button>
          </div>
        )}

        {/* ── Fail: similarity too low ── */}
        {isDone && !result.passed && result.similarity !== null && (
          <div className="result-panel result-panel--fail">
            <div className="result-icon result-icon--fail">✗</div>
            <h3>{t.notVerified}</h3>
            <p className="result-message">{result.message}</p>

            <div className="confidence-meter">
              <div className="confidence-label">
                <span>{t.matchScoreLabel}</span>
                <strong style={{ color: '#dc2626' }}>{result.similarity}%</strong>
              </div>
              <div className="confidence-bar-bg">
                <div
                  className="confidence-bar-fill"
                  style={{ width: `${result.similarity}%`, background: '#dc2626' }}
                />
              </div>
            </div>

            {result.score !== null && (
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Resemble score: <strong>{result.score}</strong>
                &nbsp;(threshold&nbsp;≥&nbsp;0.62)
              </p>
            )}

            <p className="result-retry-hint">
              {t.step7IncompleteWarning}
            </p>
            <button className="btn-step-secondary" onClick={onBack}>
              {t.back}
            </button>
          </div>
        )}

        {/* ── Error / no face detected ── */}
        {isError && (
          <div className="result-panel result-panel--fail">
            <div className="result-icon result-icon--fail" style={{ fontSize: '1.5rem' }}>!</div>
            <h3>
              {t.notVerified}
            </h3>
            <p className="result-message">{result.message}</p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="btn-step-secondary" onClick={handleRetry}>
                {t.runVerification}
              </button>
              <button className="btn-step-secondary" onClick={onBack}>
                {t.back}
              </button>
            </div>
          </div>
        )}
      </div>

      {result.status === 'idle' && (
        <div className="step-actions">
          <button className="btn-step-secondary" onClick={onBack}>
            {t.back}
          </button>
        </div>
      )}
    </div>
  );
}
