// RequirementsStep.tsx

import type { Service } from '../../types';

interface RequirementsStepProps {
  service: Service;
  onNext: () => void;
}

export function RequirementsStep({ service, onNext }: RequirementsStepProps) {
  return (
    <div className="wizard-step-content requirements-step">
      <div className="step-header">
        <div className="step-icon-circle" style={{ background: `color-mix(in srgb, ${service.color} 12%, white)`, color: service.color }}>
          📋
        </div>
        <h2>What You'll Need</h2>
        <p>Before we begin, make sure you have the following ready.</p>
      </div>

      <div className="requirements-grid">
        <div className="req-section">
          <div className="req-section-title">
            <span className="req-icon">🔐</span>
            <h3>Identity Verification</h3>
          </div>
          <p className="req-section-desc">
            We'll verify your identity in two steps: a photo of your government-issued ID, then a selfie scan.
          </p>
          <div className="req-item req-item--highlight" style={{ borderColor: service.color }}>
            <span className="req-item-check" style={{ color: service.color }}>→</span>
            <div>
              <strong>Photo ID</strong>
              <p>{service.idRequirement}</p>
            </div>
          </div>
          <div className="req-item req-item--highlight" style={{ borderColor: service.color }}>
            <span className="req-item-check" style={{ color: service.color }}>→</span>
            <div>
              <strong>Front-facing camera</strong>
              <p>Required for a live selfie scan to match your photo ID.</p>
            </div>
          </div>
        </div>

        <div className="req-section">
          <div className="req-section-title">
            <span className="req-icon">📄</span>
            <h3>Supporting Documents</h3>
          </div>
          <ul className="req-docs-list">
            {service.docs.map((doc) => (
              <li key={doc.id} className={`req-doc-item ${doc.required ? 'required' : 'optional'}`}>
                <span className="req-doc-badge">{doc.required ? 'Required' : 'Optional'}</span>
                <div>
                  <strong>{doc.label}</strong>
                  <p>{doc.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="req-section">
          <div className="req-section-title">
            <span className="req-icon">📝</span>
            <h3>Forms to Complete</h3>
          </div>
          <p className="req-section-desc">You'll need to print, fill in, and scan the following forms:</p>
          <ul className="req-forms-list">
            {service.forms.map((form) => (
              <li key={form.id} className={`req-form-item ${form.required ? 'required' : 'optional'}`}>
                <span className="req-doc-badge">{form.required ? 'Required' : 'Optional'}</span>
                <div>
                  <strong>{form.name}</strong>
                  <span className="form-number">Form {form.formNumber}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="req-section req-section--privacy">
          <div className="req-section-title">
            <span className="req-icon">🔒</span>
            <h3>Privacy & Security</h3>
          </div>
          <p>
            Your photos and documents are protected under the <em>Privacy Act</em> and the{' '}
            <em>Department of Employment and Social Development Act</em>. All data is encrypted in
            transit and at rest. Biometric scans are used solely to verify your identity for this
            application.
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#6b7280' }}>
            Processing time: <strong>{service.processingTime}</strong>
          </p>
        </div>
      </div>

      <div className="step-actions">
        <button
          className="btn-step-primary"
          style={{ background: service.color }}
          onClick={onNext}
        >
          Begin Application →
        </button>
      </div>
    </div>
  );
}