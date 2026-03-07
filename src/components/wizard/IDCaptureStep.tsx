// IdCaptureStep.tsx

// IDCaptureStep.tsx

import { useRef, useState } from 'react';
import type { CapturedPhoto } from '../../types';

interface IDCaptureStepProps {
  serviceColor: string;
  cloudName: string;
  uploadPreset: string;
  onNext: (photo: CapturedPhoto) => void;
  onBack: () => void;
}

export function IDCaptureStep({ serviceColor, cloudName, uploadPreset, onNext, onBack }: IDCaptureStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, HEIC, or WebP).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError('File is too large. Please upload an image under 15 MB.');
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData },
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || 'Upload failed. Please try again.');
      }

      const data = await response.json();

      // Build a face-cropped, enhanced transformation URL via Cloudinary
      const transformedUrl =
        `https://res.cloudinary.com/${cloudName}/image/upload/` +
        `c_fill,g_face,w_400,h_400,e_improve,q_auto,f_auto/` +
        `${data.public_id}`;

      onNext({
        publicId: data.public_id,
        secureUrl: data.secure_url,
        transformedUrl,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="wizard-step-content id-capture-step">
      <div className="step-header">
        <div className="step-icon-circle" style={{ background: `color-mix(in srgb, ${serviceColor} 12%, white)`, color: serviceColor }}>
          ID
        </div>
        <h2>Photograph Your Photo ID</h2>
        <p>
          Take a clear photo of your government-issued photo ID. Ensure all four corners are
          visible, the text is legible, and there is no glare.
        </p>
      </div>

      <div className="id-capture-layout">
        <div className="id-upload-area">
          <div
            className={`id-dropzone ${dragOver ? 'drag-over' : ''} ${preview ? 'has-preview' : ''}`}
            style={dragOver ? { borderColor: serviceColor } : undefined}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {preview ? (
              <div className="id-preview-wrap">
                <img src={preview} alt="ID preview" className="id-preview-img" />
                {uploading && (
                  <div className="id-uploading-overlay">
                    <div className="upload-spinner" />
                    <span>Uploading…</span>
                  </div>
                )}
                {!uploading && (
                  <button
                    className="id-retake-btn"
                    onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                  >
                    Retake
                  </button>
                )}
              </div>
            ) : (
              <div className="id-dropzone-empty">
                <div className="id-dropzone-icon">ID</div>
                <p className="id-dropzone-title">
                  {dragOver ? 'Drop your ID here' : 'Upload or take a photo of your ID'}
                </p>
                <p className="id-dropzone-hint">
                  Drag & drop, click to browse, or use your camera on mobile
                </p>
                <div className="id-dropzone-formats">JPEG · PNG · HEIC · WebP · Max 15 MB</div>
              </div>
            )}
          </div>

          {error && (
            <div className="step-error">
              {error}
            </div>
          )}
        </div>

        <div className="id-tips">
          <h4>Tips for a good photo</h4>
          <ul>
            <li>
              <span className="tip-icon" aria-hidden="true">1.</span>
              Place ID on a flat, dark surface for contrast
            </li>
            <li>
              <span className="tip-icon" aria-hidden="true">2.</span>
              Use good lighting — avoid flash glare on laminated IDs
            </li>
            <li>
              <span className="tip-icon" aria-hidden="true">3.</span>
              All four corners must be visible in the frame
            </li>
            <li>
              <span className="tip-icon" aria-hidden="true">4.</span>
              Your name and photo must be clearly legible
            </li>
            <li>
              <span className="tip-icon" aria-hidden="true">5.</span>
              Do not cover any part of the ID with your fingers
            </li>
          </ul>

          <div className="accepted-ids">
            <h4>Accepted IDs</h4>
            <div className="id-pill">Driver's Licence</div>
            <div className="id-pill">Passport</div>
            <div className="id-pill">PR Card</div>
            <div className="id-pill">Provincial ID Card</div>
          </div>
        </div>
      </div>

      <div className="step-actions">
        <button className="btn-step-secondary" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
}
