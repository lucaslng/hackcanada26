// WizardShell.tsx

import { Button } from '../ui/Button';
import { Step1, Step2, Step3, Step4, Step8 } from './WizardSteps';
import { Step6 } from './Step6';
import { Step7 } from './Step7Submission';
import { VerificationStep } from './VerificationStep';
import { TOTAL_STEPS, type WizardState, type WizardActions } from '../../hooks/useWizard';
import type { Language, UIStrings } from '../../constants/i18n';
import type { CapturedPhoto } from '../../types';

// Brand red — matches --red CSS token
const SERVICE_COLOR = '#c8102e';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;

/**
 * Build a Cloudinary face-crop preview URL for display in VerificationStep.
 *
 * Must match buildFaceUrl() in useFaceVerification.ts exactly so the user
 * sees the same image that the model analyses — no e_improve / e_sharpen so
 * face detection confidence scores are not degraded.
 */
function toFaceUrl(publicId: string): string {
  return (
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/` +
    `c_fill,g_face,w_400,h_400,q_auto,f_jpg/` +
    publicId
  );
}

interface WizardShellProps {
  t: UIStrings;
  state: WizardState;
  actions: WizardActions;
  serviceTitle: string;
  language: Language;
  onExit: () => void;
}

export function WizardShell({ t, state, actions, serviceTitle, language, onExit }: WizardShellProps) {
  const { step, canContinue } = state;
  const cleanTitle = (value: string) => value.replace(/^Step\s+\d+:\s*/i, '');
  const stepMeta = [
    { id: 1, icon: 'fact_check', label: cleanTitle(t.step1Title) },
    { id: 2, icon: 'contact_mail', label: cleanTitle(t.step2Title) },
    { id: 3, icon: 'upload_file', label: cleanTitle(t.step3Title) },
    { id: 4, icon: 'photo_camera_front', label: cleanTitle(t.step4Title) },
    { id: 5, icon: 'person_search', label: cleanTitle(t.step5Title) },
    { id: 6, icon: 'description', label: cleanTitle(t.step6Title) },
    { id: 7, icon: 'send', label: cleanTitle(t.step7Title) },
    { id: 8, icon: 'notifications_active', label: cleanTitle(t.step8Title) },
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 t={t} language={language} selectedOption={state.selectedOption} serviceTitle={serviceTitle} />;
      case 2:
        return (
          <Step2
            t={t}
            language={language}
            contactInfo={state.contactInfo}
            onFieldChange={actions.updateContactField}
          />
        );
      case 3:
        return (
          <Step3 t={t} idPhoto={state.idPhoto} onUpload={actions.setIdPhoto} />
        );
      case 4:
        return (
          <Step4
            t={t}
            facePhoto={state.facePhoto}
            onUpload={actions.setFacePhoto}
          />
        );
      case 5: {
        // Guard: both photos must be uploaded before verification
        if (!state.idPhoto || !state.facePhoto) {
          return (
            <div className="status-neutral" style={{ margin: '2rem 0' }}>
              Please complete steps 3 and 4 (upload your ID and selfie) before running verification.
            </div>
          );
        }

        const idCaptured: CapturedPhoto = {
          publicId: state.idPhoto.public_id,
          transformedUrl: toFaceUrl(state.idPhoto.public_id),
        };
        const selfieCaptured: CapturedPhoto = {
          publicId: state.facePhoto.public_id,
          transformedUrl: toFaceUrl(state.facePhoto.public_id),
        };

        return (
          <VerificationStep
            t={t}
            idPhoto={idCaptured}
            selfiePhoto={selfieCaptured}
            serviceColor={SERVICE_COLOR}
            onNext={(result) => {
              actions.setMatchScore(result.confidence);
              actions.goNext();
            }}
            onBack={actions.goBack}
          />
        );
      }
      case 6:
        return (
          <Step6
            t={t}
            selectedOption={state.selectedOption}
            requiredUploads={state.requiredUploads}
            onRequiredUpload={actions.setRequiredUpload}
          />
        );
      case 7:
        return (
          <Step7
            t={t}
            language={language}
            idPhoto={state.idPhoto}
            facePhoto={state.facePhoto}
            contactInfo={state.contactInfo}
            selectedOption={state.selectedOption}
            serviceTitle={serviceTitle}
            matchScore={state.matchScore}
            requiredUploads={state.requiredUploads}
          />
        );
      case 8:
        return (
          <Step8
            t={t}
            notificationChannel={state.notificationChannel}
            contactValue={state.contactValue}
            notificationSaved={state.notificationSaved}
            onChannelChange={actions.setNotificationChannel}
            onContactChange={actions.setContactValue}
            onSave={actions.saveNotifications}
          />
        );
      default:
        return null;
    }
  };

  // Step 5 manages its own navigation (VerificationStep has built-in back/continue)
  const isVerificationStep = step === 5;

  return (
    <div className="renewal-shell">
      <div className="step-header">
        <p className="step-count">
          {t.stepOf} {step} {t.of} {TOTAL_STEPS} — {serviceTitle}
        </p>
        <div className="step-progress">
          <div style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
        </div>
        <ol className="step-node-list" aria-label="Wizard steps">
          {stepMeta.map((node) => {
            const isDone = node.id < step;
            const isCurrent = node.id === step;
            const isLocked = node.id > step;
            const className = [
              'step-node',
              isDone ? 'is-done' : '',
              isCurrent ? 'is-current' : '',
              isLocked ? 'is-locked' : '',
            ].filter(Boolean).join(' ');
            return (
              <li key={node.id} className={className}>
                <button
                  type="button"
                  className="step-node-btn"
                  onClick={() => actions.jumpToStep(node.id)}
                  disabled={!isDone}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  <span className="step-node-index">{isDone ? '✓' : node.id}</span>
                  <span className="material-symbols-outlined">{node.icon}</span>
                  <span className="step-node-label">{node.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div key={step} className="step-content-shell">
        {renderStep()}
      </div>

      {/* Hide the shared nav bar on step 5 — VerificationStep has its own controls */}
      {!isVerificationStep && (
        <div className="wizard-nav wizard-nav-sticky">
          <div className="wizard-nav-left">
            <Button
              variant="ghost"
              onClick={actions.goBack}
              disabled={step === 1}
            >
              {t.back}
            </Button>
            <Button variant="ghost" onClick={onExit}>
              {t.exitSetup}
            </Button>
          </div>
          <div className="wizard-nav-right">
            {step < TOTAL_STEPS ? (
              <Button onClick={actions.goNext} disabled={!canContinue}>
                {t.continue}
              </Button>
            ) : (
              <Button onClick={onExit}>{t.returnHome}</Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}