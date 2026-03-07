// WizardShell.tsx

import { Button } from '../ui/Button';
import { Step1, Step2, Step3, Step4, Step5, Step8 } from './WizardSteps';
import { Step6 } from './Step6';
import { Step7 } from './Step7Submission';
import { TOTAL_STEPS, type WizardState, type WizardActions } from '../../hooks/useWizard';
import type { Language, UIStrings } from '../../constants/i18n';

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
      case 5:
        return (
          <Step5
            t={t}
            idPhoto={state.idPhoto}
            facePhoto={state.facePhoto}
            matchScore={state.matchScore}
            onCompare={actions.compareFaces}
          />
        );
      case 6:
        return <Step6 t={t} selectedOption={state.selectedOption} />;
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

  return (
    <div className="renewal-shell">
      <div className="step-header">
        <p className="step-count">
          {t.stepOf} {step} {t.of} {TOTAL_STEPS} — {serviceTitle}
        </p>
        <div className="step-progress">
          <div style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
        </div>
      </div>

      {renderStep()}

      <div className="wizard-nav">
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
    </div>
  );
}
