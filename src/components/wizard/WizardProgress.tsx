// wizardProgress.tsx

import type { WizardStep } from '../../types';

const STEPS: { id: WizardStep; label: string; icon: string }[] = [
  { id: 'requirements', label: 'Requirements', icon: '1' },
  { id: 'id-capture', label: 'Photo ID', icon: '2' },
  { id: 'face-scan', label: 'Face Scan', icon: '3' },
  { id: 'verification', label: 'Verification', icon: '4' },
  { id: 'forms', label: 'Documents', icon: '5' },
  { id: 'submit', label: 'Submit', icon: '6' },
];

interface WizardProgressProps {
  currentStep: WizardStep;
  serviceColor: string;
}

export function WizardProgress({ currentStep, serviceColor }: WizardProgressProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="wizard-progress">
      {STEPS.map((step, index) => {
        const isDone = index < currentIndex;
        const isActive = index === currentIndex;
        const isFuture = index > currentIndex;
        return (
          <div key={step.id} className={`wizard-step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''} ${isFuture ? 'future' : ''}`}>
            {index > 0 && (
              <div
                className={`wizard-connector ${isDone ? 'done' : ''}`}
                style={isDone ? { background: serviceColor } : undefined}
              />
            )}
            <div
              className="wizard-step-bubble"
              style={isActive || isDone ? { background: serviceColor, borderColor: serviceColor } : undefined}
            >
              {isDone ? '✓' : isActive ? step.icon : index + 1}
            </div>
            <span className="wizard-step-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}
