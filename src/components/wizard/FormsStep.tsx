// FormStep.tsx

// FormsStep.tsx

import { useState } from 'react';
import { AdvancedImage, lazyload, placeholder } from '@cloudinary/react';
import { UploadWidget } from '../../cloudinary/UploadWidget';
import type { CloudinaryUploadResult } from '../../cloudinary/UploadWidget';
import { docPreviewImage } from '../../cloudinary/transformations';
import type { Service, UploadedFile } from '../../types';

interface FormsStepProps {
  service: Service;
  serviceColor: string;
  onNext: (uploads: UploadedFile[]) => void;
  onBack: () => void;
}

export function FormsStep({ service, serviceColor, onNext, onBack }: FormsStepProps) {
  const [checkedForms, setCheckedForms] = useState<Set<string>>(new Set());
  const [uploads, setUploads] = useState<Record<string, UploadedFile>>({});
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [activeFormId, setActiveFormId] = useState<string | null>(null);

  const toggleFormChecked = (id: string) => {
    setCheckedForms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleUpload = (result: CloudinaryUploadResult, docId: string, docLabel: string) => {
    setUploads((prev) => ({
      ...prev,
      [docId]: { docId, docLabel, publicId: result.public_id, secureUrl: result.secure_url },
    }));
    setActiveDocId(null);
    setActiveFormId(null);
  };

  // Determine if can proceed: all required docs uploaded AND all required forms checked
  const requiredDocsComplete = service.docs.filter((d) => d.required).every((d) => d.id in uploads);
  const requiredFormsComplete = service.forms.filter((f) => f.required).every((f) => checkedForms.has(f.id));
  const canProceed = requiredDocsComplete && requiredFormsComplete;

  const uploadedCount = Object.keys(uploads).length;
  const totalDocs = service.docs.length;

  return (
    <div className="wizard-step-content forms-step">
      <div className="step-header">
        <div className="step-icon-circle" style={{ background: `color-mix(in srgb, ${serviceColor} 12%, white)`, color: serviceColor }}>
          DOC
        </div>
        <h2>Documents &amp; Forms</h2>
        <p>Upload your supporting documents and confirm you have filled in the required forms.</p>
      </div>

      <div className="forms-layout">
        {/* Forms to print & fill */}
        <div className="forms-section">
          <div className="forms-section-header">
            <h3>Forms to complete</h3>
            <p>Download each form, fill it in by hand or digitally, then scan and upload below.</p>
          </div>

          <div className="forms-list">
            {service.forms.map((form) => (
              <div key={form.id} className={`form-card ${checkedForms.has(form.id) ? 'checked' : ''}`}>
                <div className="form-card-header">
                  <div className="form-card-meta">
                    <span className="form-number-badge">Form {form.formNumber}</span>
                    {form.required && <span className="required-badge">Required</span>}
                  </div>
                  <h4 className="form-card-name">{form.name}</h4>
                  <p className="form-card-desc">{form.description}</p>
                </div>
                <div className="form-card-actions">
                  <a
                    href={form.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-form-download"
                    style={{ borderColor: serviceColor, color: serviceColor }}
                  >
                    Download form
                  </a>

                  {/* Toggle upload for this form's scanned copy */}
                  <button
                    className={`btn-form-upload ${activeFormId === form.id ? 'active' : ''}`}
                    style={uploads[`form-${form.id}`] ? { borderColor: '#16a34a', color: '#16a34a' } : undefined}
                    onClick={() => setActiveFormId(activeFormId === form.id ? null : form.id)}
                  >
                    {uploads[`form-${form.id}`] ? 'Uploaded' : 'Upload completed form'}
                  </button>

                  <label className="form-check-label">
                    <input
                      type="checkbox"
                      checked={checkedForms.has(form.id)}
                      onChange={() => toggleFormChecked(form.id)}
                    />
                    <span>I have filled in and uploaded this form</span>
                  </label>
                </div>

                {activeFormId === form.id && (
                  <div className="inline-upload-panel">
                    <UploadWidget
                      onUploadSuccess={(r) => handleUpload(r, `form-${form.id}`, `${form.name} (filled)`)}
                      onUploadError={(e) => alert(`Upload failed: ${e.message}`)}
                      buttonText={`Upload Completed ${form.formNumber}`}
                    />
                    <p className="upload-hint">Scan or photograph the completed, signed form</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Supporting Documents */}
        <div className="forms-section">
          <div className="forms-section-header">
            <h3>Supporting documents</h3>
            <div className="doc-progress">
              <span>{uploadedCount} of {totalDocs} uploaded</span>
              <div className="doc-progress-bar">
                <div
                  className="doc-progress-fill"
                  style={{ width: `${(uploadedCount / totalDocs) * 100}%`, background: serviceColor }}
                />
              </div>
            </div>
          </div>

          <div className="supporting-docs-list">
            {service.docs.map((doc) => {
              const uploaded = uploads[doc.id];
              const isActive = activeDocId === doc.id;
              const preview = uploaded ? docPreviewImage(uploaded.publicId) : null;

              return (
                <div
                  key={doc.id}
                  className={`doc-item ${uploaded ? 'uploaded' : ''} ${isActive ? 'active' : ''}`}
                >
                  <div className="doc-item-header">
                    <div className="doc-check">{uploaded ? '✓' : doc.required ? '●' : '○'}</div>
                    <div className="doc-info">
                      <div className="doc-label">
                        {doc.label}
                        {doc.required && <span className="required-badge">Required</span>}
                      </div>
                      <div className="doc-description">{doc.description}</div>
                    </div>
                    {uploaded ? (
                      <button className="doc-replace-btn" onClick={() => setActiveDocId(isActive ? null : doc.id)}>
                        {isActive ? 'Cancel' : 'Replace'}
                      </button>
                    ) : (
                      <button
                        className="doc-upload-btn"
                        style={{ '--service-color': serviceColor } as React.CSSProperties}
                        onClick={() => setActiveDocId(isActive ? null : doc.id)}
                      >
                        {isActive ? 'Cancel' : 'Upload'}
                      </button>
                    )}
                  </div>

                  {uploaded && !isActive && preview && (
                    <div className="doc-preview">
                      <AdvancedImage
                        cldImg={preview}
                        plugins={[placeholder({ mode: 'blur' }), lazyload()]}
                        alt={doc.label}
                        className="doc-preview-img"
                      />
                      <span className="doc-preview-label">✓ Uploaded</span>
                    </div>
                  )}

                  {isActive && (
                    <div className="doc-upload-panel">
                      <UploadWidget
                        onUploadSuccess={(r) => handleUpload(r, doc.id, doc.label)}
                        onUploadError={(e) => alert(`Upload failed: ${e.message}`)}
                        buttonText={`Upload ${doc.label}`}
                      />
                      <p className="upload-hint">Accepted: JPEG, PNG, PDF, HEIC — Max 10 MB</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="step-actions step-actions--end">
        <button className="btn-step-secondary" onClick={onBack}>
          Back
        </button>
        <button
          className="btn-step-primary"
          style={{ background: canProceed ? serviceColor : '#9ca3af', cursor: canProceed ? 'pointer' : 'not-allowed' }}
          disabled={!canProceed}
          onClick={() => canProceed && onNext(Object.values(uploads))}
          title={!canProceed ? 'Upload all required documents and confirm all required forms' : undefined}
        >
          Review and submit
        </button>
      </div>

      {!canProceed && (
        <p className="step-warning">
          {!requiredDocsComplete && 'Upload all required documents. '}
          {!requiredFormsComplete && 'Confirm all required forms are filled.'}
        </p>
      )}
    </div>
  );
}
