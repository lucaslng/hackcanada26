// ServiceView.tsx

import { useState } from 'react';
import { submitApplication } from '../api/submitApplication';
import { uploadPreset } from '../cloudinary/config';
import { WizardProgress } from './wizard/WizardProgress';
import { RequirementsStep } from './wizard/RequirementsStep';
import { IDCaptureStep } from './wizard/IdCaptureStep';
import { FaceScanStep } from './wizard/FacescanStep';
import { VerificationStep } from './wizard/VerificationStep';
import { FormsStep } from './wizard/FormsStep';
import type { CapturedPhoto, Service, UploadedFile, VerificationResult, WizardStep } from '../types';

interface ServiceViewProps {
  service: Service;
  onBack: () => void;
  onSubmit: (
    files: UploadedFile[],
    referenceNumber: string,
  ) => void;
}

export function ServiceView({ service, onBack, onSubmit }: ServiceViewProps) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;

  const [step, setStep] = useState<WizardStep>('requirements');
  const [idPhoto, setIdPhoto] = useState<CapturedPhoto | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<CapturedPhoto | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  /* ── Step handlers ── */

  const handleIdCaptured = (photo: CapturedPhoto) => {
    setIdPhoto(photo);
    setStep('face-scan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelfieCaptured = (photo: CapturedPhoto) => {
    setSelfiePhoto(photo);
    setStep('verification');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVerified = (_result: VerificationResult) => {
    setStep('forms');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormsComplete = async (files: UploadedFile[]) => {
    setSubmitting(true);
    setSubmitError(null);

    // Include identity photos in the submission payload
    const allFiles: UploadedFile[] = [
      ...(idPhoto ? [{ docId: 'id-photo', docLabel: 'Government-Issued Photo ID', publicId: idPhoto.publicId, secureUrl: idPhoto.secureUrl }] : []),
      ...(selfiePhoto ? [{ docId: 'selfie', docLabel: 'Identity Selfie', publicId: selfiePhoto.publicId, secureUrl: selfiePhoto.secureUrl }] : []),
      ...files,
    ];

    try {
      const { referenceNumber } = await submitApplication({
        serviceId: service.id,
        files: allFiles,
      });
      onSubmit(allFiles, referenceNumber);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
      setSubmitting(false);
    }
  };

  /* ── Render ── */
  return (
    <div className="wizard-container">
      {/* Service banner */}
      <div
        className="service-view-header"
        style={{ '--service-color': service.color } as React.CSSProperties}
      >
        <div className="service-view-icon">{service.icon}</div>
        <div>
          <p className="service-view-eyebrow">{service.subtitle}</p>
          <h1 className="service-view-title">{service.title}</h1>
          <p className="service-view-desc">{service.description}</p>
        </div>
        <div className="service-view-meta">
          <div className="meta-pill">⏱ Processing: {service.processingTime}</div>
        </div>
      </div>

      <button className="back-btn" onClick={onBack} style={{ marginTop: '1rem' }}>
        ← Back to Services
      </button>

      {/* Wizard progress */}
      <WizardProgress currentStep={step} serviceColor={service.color} />

      {/* Step panels */}
      {step === 'requirements' && (
        <RequirementsStep
          service={service}
          onNext={() => setStep('id-capture')}
        />
      )}

      {step === 'id-capture' && (
        <IDCaptureStep
          serviceColor={service.color}
          cloudName={cloudName}
          uploadPreset={uploadPreset}
          onNext={handleIdCaptured}
          onBack={() => setStep('requirements')}
        />
      )}

      {step === 'face-scan' && (
        <FaceScanStep
          serviceColor={service.color}
          cloudName={cloudName}
          uploadPreset={uploadPreset}
          onNext={handleSelfieCaptured}
          onBack={() => setStep('id-capture')}
        />
      )}

      {step === 'verification' && idPhoto && selfiePhoto && (
        <VerificationStep
          idPhoto={idPhoto}
          selfiePhoto={selfiePhoto}
          serviceColor={service.color}
          onNext={handleVerified}
          onBack={() => setStep('face-scan')}
        />
      )}

      {step === 'forms' && (
        <>
          <FormsStep
            service={service}
            serviceColor={service.color}
            onNext={handleFormsComplete}
            onBack={() => setStep('verification')}
          />
          {submitError && (
            <p className="step-warning" style={{ marginTop: '0.5rem' }}>⚠ {submitError}</p>
          )}
          {submitting && (
            <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-soft)' }}>
              Submitting your application…
            </div>
          )}
        </>
      )}
    </div>
  );
}