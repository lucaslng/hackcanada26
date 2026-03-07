// ServiceView.tsx

import { useState } from 'react';
import { AdvancedImage, lazyload, placeholder } from '@cloudinary/react';
import { submitApplication } from '../api/submitApplication';
import { UploadWidget } from '../cloudinary/UploadWidget';
import type { CloudinaryUploadResult } from '../cloudinary/UploadWidget';
import { docPreviewImage } from '../cloudinary/transformations';
import { useDocumentUpload } from '../hooks/useDocumentUpload';
import type { Service } from '../types';

interface ServiceViewProps {
  service: Service;
  onBack: () => void;
  onSubmit: (
    files: { docId: string; docLabel: string; publicId: string; secureUrl: string }[],
    referenceNumber: string,
  ) => void;
}

export function ServiceView({ service, onBack, onSubmit }: ServiceViewProps) {
  const {
    uploads,
    activeDoc,
    progress,
    completedCount,
    totalCount,
    requiredComplete,
    setActiveDoc,
    handleUploadSuccess,
  } = useDocumentUpload(service.docs);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { referenceNumber } = await submitApplication({
        serviceId: service.id,
        files: Object.values(uploads),
      });
      onSubmit(Object.values(uploads), referenceNumber);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Submission failed. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDocUpload = (result: CloudinaryUploadResult, docId: string, docLabel: string) => {
    handleUploadSuccess(result, docId, docLabel);
  };

  return (
    <div className="service-view">
      <button className="back-btn" onClick={onBack}>
        ← Back to Services
      </button>

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
          <div className="meta-pill">⏱ Processing time: {service.processingTime}</div>
        </div>
      </div>

      <div className="service-view-body">
        <div className="upload-col">
          <div className="progress-bar-wrap">
            <div className="progress-label">
              <span>
                {completedCount} of {totalCount} documents uploaded
              </span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={
                  {
                    width: `${progress}%`,
                    '--service-color': service.color,
                  } as React.CSSProperties
                }
              />
            </div>
          </div>

          <div className="doc-list">
            {service.docs.map((doc) => {
              const uploaded = uploads[doc.id];
              const isActive = activeDoc === doc.id;
              const previewImage = uploaded ? docPreviewImage(uploaded.publicId) : null;

              return (
                <div
                  key={doc.id}
                  className={`doc-item ${uploaded ? 'uploaded' : ''} ${isActive ? 'active' : ''}`}
                >
                  <div className="doc-item-header">
                    <div className="doc-check">
                      {uploaded ? '✓' : doc.required ? '●' : '○'}
                    </div>
                    <div className="doc-info">
                      <div className="doc-label">
                        {doc.label}
                        {doc.required && <span className="required-badge">Required</span>}
                      </div>
                      <div className="doc-description">{doc.description}</div>
                    </div>

                    {uploaded ? (
                      <button
                        className="doc-replace-btn"
                        onClick={() => setActiveDoc(isActive ? null : doc.id)}
                      >
                        {isActive ? 'Cancel' : 'Replace'}
                      </button>
                    ) : (
                      <button
                        className="doc-upload-btn"
                        style={{ '--service-color': service.color } as React.CSSProperties}
                        onClick={() => setActiveDoc(isActive ? null : doc.id)}
                      >
                        {isActive ? 'Cancel' : '+ Upload'}
                      </button>
                    )}
                  </div>

                  {uploaded && !isActive && previewImage && (
                    <div className="doc-preview">
                      <AdvancedImage
                        cldImg={previewImage}
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
                        onUploadSuccess={(result) =>
                          handleDocUpload(result, doc.id, doc.label)
                        }
                        onUploadError={(err) => alert(`Upload failed: ${err.message}`)}
                        buttonText={`Upload ${doc.label}`}
                      />
                      <p className="upload-hint">
                        Accepted: JPEG, PNG, PDF, HEIC — Max 10 MB per file
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <aside className="service-sidebar">
          <div className="sidebar-card">
            <h3>Before You Submit</h3>
            <ul className="checklist">
              <li>All documents must be legible and unobstructed</li>
              <li>Photos must show all four corners of the document</li>
              <li>Files must be under 10 MB each</li>
              <li>Accepted formats: JPEG, PNG, PDF, HEIC</li>
            </ul>
          </div>
          <div className="sidebar-card sidebar-card--privacy">
            <h3>🔒 Privacy Notice</h3>
            <p>
              Your documents are collected under the authority of the{' '}
              <em>Department of Employment and Social Development Act</em> and are protected under
              the <em>Privacy Act</em>. Documents are encrypted in transit and at rest.
            </p>
          </div>
          <div className="sidebar-card">
            <h3>Need Help?</h3>
            <p>
              Call <strong>1-800-O-Canada</strong> (1-800-622-6232) Monday–Friday, 8am–8pm local
              time.
            </p>
          </div>
        </aside>
      </div>

      <div className="submit-bar">
        {submitError && (
          <p className="submit-warning">⚠ {submitError}</p>
        )}
        {!requiredComplete && !submitError && (
          <p className="submit-warning">
            ⚠ Please upload all required documents before submitting.
          </p>
        )}
        <button
          className="btn-submit"
          style={{ '--service-color': service.color } as React.CSSProperties}
          disabled={!requiredComplete || submitting}
          onClick={handleSubmit}
        >
          {submitting ? (
            <span className="submitting-dots">
              Submitting<span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          ) : (
            'Submit Application →'
          )}
        </button>
      </div>
    </div>
  );
}