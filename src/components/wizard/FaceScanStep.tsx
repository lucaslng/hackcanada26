// FacescanStep.tsx

// FaceScanStep.tsx

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CapturedPhoto } from '../../types';

interface FaceScanStepProps {
  serviceColor: string;
  cloudName: string;
  uploadPreset: string;
  onNext: (photo: CapturedPhoto) => void;
  onBack: () => void;
}

type ScanState = 'idle' | 'active' | 'captured' | 'uploading' | 'done' | 'error';

export function FaceScanStep({ serviceColor, cloudName, uploadPreset, onNext, onBack }: FaceScanStepProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraReady(true);
          setScanState('active');
        };
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Camera access denied.';
      setError(
        msg.includes('Permission') || msg.includes('denied')
          ? 'Camera access denied. Please allow camera access in your browser settings and try again.'
          : 'Unable to access your camera. Please ensure no other app is using it.',
      );
    }
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mirror the image (since front camera is mirrored in preview)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedDataUrl(dataUrl);
    setScanState('captured');
    stopCamera();
  };

  const retake = () => {
    setCapturedDataUrl(null);
    setScanState('idle');
    setError(null);
  };

  const uploadToCloudinary = async () => {
    if (!capturedDataUrl) return;
    setScanState('uploading');
    setError(null);

    try {
      // Convert dataURL to Blob
      const res = await fetch(capturedDataUrl);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append('file', blob, 'selfie.jpg');
      formData.append('upload_preset', uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData },
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || 'Upload failed.');
      }

      const data = await response.json();

      // Apply Cloudinary AI transformations:
      // - c_fill,g_face: crop tightly around detected face
      // - w_400,h_400: uniform size
      // - e_improve: auto-enhance clarity & color
      // - e_sharpen: improve sharpness
      // - e_background_removal is an add-on; we use e_improve as a fallback
      const transformedUrl =
        `https://res.cloudinary.com/${cloudName}/image/upload/` +
        `c_fill,g_face,w_400,h_400,e_improve,e_sharpen:80,q_auto,f_auto/` +
        `${data.public_id}`;

      setScanState('done');

      onNext({
        publicId: data.public_id,
        secureUrl: data.secure_url,
        transformedUrl,
      });
    } catch (err) {
      setScanState('error');
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    }
  };

  return (
    <div className="wizard-step-content face-scan-step">
      <div className="step-header">
        <div className="step-icon-circle" style={{ background: `color-mix(in srgb, ${serviceColor} 12%, white)`, color: serviceColor }}>
          FS
        </div>
        <h2>Live Face Scan</h2>
        <p>
          We'll take a selfie to match against your ID photo. Look directly at the camera in
          a well-lit area.
        </p>
      </div>

      <div className="face-scan-layout">
        <div className="camera-area">
          {/* Hidden canvas for capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {scanState === 'idle' && (
            <div className="camera-idle">
              <div className="camera-idle-icon">CAM</div>
              <p>Click below to activate your camera</p>
              <button
                className="btn-step-primary"
                style={{ background: serviceColor }}
                onClick={startCamera}
              >
                Activate Camera
              </button>
              {error && <div className="step-error" style={{ marginTop: '1rem' }}>{error}</div>}
            </div>
          )}

          {(scanState === 'active' || scanState === 'captured') && (
            <div className="camera-frame-wrap">
              <div className={`camera-frame ${scanState === 'active' && cameraReady ? 'scanning' : ''}`}
                   style={{ borderColor: serviceColor }}>
                {/* Live video (hidden once captured) */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="camera-video"
                  style={{
                    display: scanState === 'active' ? 'block' : 'none',
                    transform: 'scaleX(-1)',
                  }}
                />

                {/* Captured still */}
                {scanState === 'captured' && capturedDataUrl && (
                  <img src={capturedDataUrl} alt="Captured selfie" className="camera-captured" />
                )}

                {/* Face guide oval */}
                {scanState === 'active' && (
                  <div className="face-guide">
                    <div className="face-guide-oval" style={{ borderColor: serviceColor }} />
                    <span className="face-guide-label">Centre your face</span>
                  </div>
                )}

                {/* Scan line animation */}
                {scanState === 'active' && cameraReady && (
                  <div className="scan-line" style={{ background: serviceColor }} />
                )}
              </div>

              {scanState === 'active' && cameraReady && (
                <button
                  className="btn-capture"
                  style={{ background: serviceColor }}
                  onClick={captureFrame}
                >
                  Capture photo
                </button>
              )}

              {scanState === 'captured' && (
                <div className="capture-actions">
                  <button className="btn-step-secondary" onClick={retake}>
                    Retake
                  </button>
                  <button
                    className="btn-step-primary"
                    style={{ background: serviceColor }}
                    onClick={uploadToCloudinary}
                  >
                    Use this photo
                  </button>
                </div>
              )}
            </div>
          )}

          {scanState === 'uploading' && (
            <div className="uploading-state">
              <div className="cloudinary-processing">
                <div className="processing-spinner" style={{ borderTopColor: serviceColor }} />
                <h3>Processing image</h3>
                <div className="processing-steps">
                  <div className="proc-step active">Uploading image...</div>
                  <div className="proc-step">Validating image quality...</div>
                  <div className="proc-step">Preparing verification copy...</div>
                  <div className="proc-step">Finalizing upload...</div>
                </div>
              </div>
            </div>
          )}

          {scanState === 'done' && (
            <div className="done-state">
              <div className="done-icon" style={{ color: serviceColor }}>✓</div>
              <p>Selfie processed successfully</p>
            </div>
          )}

          {scanState === 'error' && (
            <div className="camera-idle">
              <div className="step-error">{error}</div>
              <button
                className="btn-step-primary"
                style={{ background: serviceColor, marginTop: '1rem' }}
                onClick={retake}
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <div className="face-scan-tips">
          <h4>For the best scan</h4>
          <ul>
            <li><span className="tip-icon" aria-hidden="true">1.</span> Sit in a well-lit area, facing a light source</li>
            <li><span className="tip-icon" aria-hidden="true">2.</span> Look directly at the camera lens</li>
            <li><span className="tip-icon" aria-hidden="true">3.</span> Keep a neutral expression</li>
            <li><span className="tip-icon" aria-hidden="true">4.</span> Remove glasses, hats, or face coverings</li>
            <li><span className="tip-icon" aria-hidden="true">5.</span> Hold the device steady at eye level</li>
          </ul>

          <div className="cloudinary-badge">
            <span className="cloudinary-badge-icon" aria-hidden="true">SEC</span>
            <div>
              <strong>Secure image handling</strong>
              <p>Your selfie is processed automatically to support identity verification for this application.</p>
            </div>
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
