// ConfirmationView.tsx

import type { Service, UploadedFile } from '../types';

interface ConfirmationViewProps {
  service: Service;
  files: UploadedFile[];
  onHome: () => void;
}

export function ConfirmationView({ service, files, onHome }: ConfirmationViewProps) {
  const refNumber = `SC-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="confirmation-view">
      <div className="confirmation-card">
        <div
          className="confirmation-icon"
          style={{ '--service-color': service.color } as React.CSSProperties}
        >
          ✓
        </div>
        <h1 className="confirmation-title">Application Submitted</h1>
        <p className="confirmation-subtitle">
          Your documents for <strong>{service.title}</strong> have been received.
        </p>

        <div className="confirmation-ref">
          <span className="ref-label">Reference Number</span>
          <span className="ref-number">{refNumber}</span>
          <span className="ref-note">Keep this number for your records.</span>
        </div>

        <div className="confirmation-docs">
          <h3>Documents Received ({files.length})</h3>
          <ul>
            {files.map((f) => (
              <li key={f.docId}>
                <span className="conf-check">✓</span> {f.docLabel}
              </li>
            ))}
          </ul>
        </div>

        <div className="confirmation-next">
          <h3>What Happens Next?</h3>
          <ol>
            <li>
              A Service Canada officer will review your documents within{' '}
              <strong>{service.processingTime}</strong>.
            </li>
            <li>
              You will be contacted by mail or phone if additional information is needed.
            </li>
            <li>
              You can check the status of your application by calling{' '}
              <strong>1-800-622-6232</strong> with your reference number.
            </li>
          </ol>
        </div>

        <button className="btn-home" onClick={onHome}>
          Return to Services
        </button>
      </div>
    </div>
  );
}