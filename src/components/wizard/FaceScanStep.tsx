// FacescanStep.tsx

// FacescanStep.ts// FaceScanStep.tsx

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CapturedPhoto } from '../../types';

interface FaceScanStepProps {
  serviceColor: string;
  cloudName: string;
  uploadPreset: string;
  onNext: (photo: CapturedPhoto) => void;
  onBack: () => void;
}

type ScanState = 'idle' | 'starting' | 'active' | 'captured' | 'uploading' | 'done' | 'error';

const PROCESSING_STEPS = [
  '🤳 Uploading selfie…',
  '✂️ Auto-cropping face region…',
  '✨ Enhancing image clarity…',
  '🔆 Applying sharpening filter…',
];

export function FaceScanStep({
  serviceColor,
  cloudName,
  uploadPreset,
  onNext,
  onBack,
}: FaceScanStepProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [scanState, setScanState] = useState<ScanState>('idle');
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Track which processing step is highlighted during upload
  const [procStep, setProcStep] = useState(0);

  /** Fully stop the camera stream and clear the video element. */
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Stop camera when the component unmounts (e.g. user navigates away).
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const startCamera = useCallback(async () => {
    setError(null);
    setScanState('starting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });

      streamRef.current = stream;

      if (!videoRef.current) {
        // Component was unmounted while we awaited getUserMedia
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      videoRef.current.srcObject = stream;

      // Wait for metadata so videoWidth/Height are available before we mark active.
      videoRef.current.onloadedmetadata = () => {
        videoRef.current
          ?.play()
          .then(() => setScanState('active'))
          .catch(() => {
            setError('Could not start video playback. Please try again.');
            stopCamera();
            setScanState('error');
          });
      };
    } catch (err) {
      stopCamera();
      setScanState('error');

      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError(
            'Camera access was denied. Please allow camera access in your browser settings and try again.',
          );
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError(
            'No camera was found on this device. Please connect a camera and try again.',
          );
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setError(
            'Your camera is in use by another application. Please close it and try again.',
          );
        } else {
          setError(`Camera error: ${err.message}`);
        }
      } else {
        setError('Unable to access your camera. Please try again.');
      }
    }
  }, [stopCamera]);

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || scanState !== 'active') return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mirror horizontally to match the mirrored preview.
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    ctx.restore();

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedDataUrl(dataUrl);
    stopCamera();
    setScanState('captured');
  };

  const retake = () => {
    setCapturedDataUrl(null);
    setError(null);
    setScanState('idle');
  };

  const uploadToCloudinary = async () => {
    if (!capturedDataUrl) return;

    setScanState('uploading');
    setError(null);
    setProcStep(0);

    // Animate through processing steps while the upload runs.
    const stepInterval = setInterval(() => {
      setProcStep((prev) => {
        if (prev < PROCESSING_STEPS.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 600);

    try {
      const res = await fetch(capturedDataUrl);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append('file', blob, 'selfie.jpg');
      formData.append('upload_preset', uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData },
      );

      clearInterval(stepInterval);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || 'Upload failed. Please try again.');
      }

      const data = await response.json();

      // Face-crop + enhance via Cloudinary URL transformations.
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
      clearInterval(stepInterval);
      setScanState('error');
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    }
  };

  // ── Render helpers ──────────────────────────────────────────────────────

  const showVideo = scanState === 'starting' || scanState === 'active';
  const isLive = scanState === 'active';

  return (
    <div className="wizard-step-content face-scan-step">
      <div className="step-header">
        <div
          className="step-icon-circle"
          style={{
            background: `color-mix(in srgb, ${serviceColor} 12%, white)`,
            color: serviceColor,
          }}
        >
          🤳
        </div>
        <h2>Live Face Scan</h2>
        <p>
          We'll take a selfie to match against your ID photo. Look directly at the camera in a
          well-lit area.
        </p>
      </div>

      <div className="face-scan-layout">
        {/* ── Camera area ── */}
        <div className="camera-area">
          {/* Hidden canvas used only for frame capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* ── Idle ── */}
          {scanState === 'idle' && (
            <div className="camera-idle">
              <div className="camera-idle-icon">📷</div>
              <p>Click below to activate your camera</p>
              <button
                className="btn-step-primary"
                style={{ background: serviceColor }}
                onClick={startCamera}
              >
                Activate Camera
              </button>
            </div>
          )}

          {/* ── Starting (waiting for stream) ── */}
          {scanState === 'starting' && (
            <div className="camera-idle">
              <div className="processing-spinner" style={{ borderTopColor: serviceColor }} />
              <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginTop: '0.75rem' }}>
                Starting camera…
              </p>
            </div>
          )}

          {/* ── Live / Captured ── */}
          {(showVideo || scanState === 'captured') && (
            <div className="camera-frame-wrap">
              <div
                className={`camera-frame ${isLive ? 'scanning' : ''}`}
                style={{ borderColor: serviceColor }}
              >
                {/* Live video — always rendered so the ref is available; hidden after capture */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="camera-video"
                  style={{
                    display: showVideo ? 'block' : 'none',
                    transform: 'scaleX(-1)',
                  }}
                />

                {/* Captured still */}
                {scanState === 'captured' && capturedDataUrl && (
                  <img src={capturedDataUrl} alt="Captured selfie" className="camera-captured" />
                )}

                {/* Face-guide oval — only when live feed is playing */}
                {isLive && (
                  <div className="face-guide">
                    <div className="face-guide-oval" style={{ borderColor: serviceColor }} />
                    <span className="face-guide-label">Centre your face</span>
                  </div>
                )}

                {/* Animated scan line */}
                {isLive && (
                  <div className="scan-line" style={{ background: serviceColor }} />
                )}
              </div>

              {isLive && (
                <button
                  className="btn-capture"
                  style={{ background: serviceColor }}
                  onClick={captureFrame}
                >
                  📸 Capture Photo
                </button>
              )}

              {scanState === 'captured' && (
                <div className="capture-actions">
                  <button className="btn-step-secondary" onClick={retake}>
                    ↺ Retake
                  </button>
                  <button
                    className="btn-step-primary"
                    style={{ background: serviceColor }}
                    onClick={uploadToCloudinary}
                  >
                    Use this photo →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Uploading / processing ── */}
          {scanState === 'uploading' && (
            <div className="uploading-state">
              <div className="cloudinary-processing">
                <div className="processing-spinner" style={{ borderTopColor: serviceColor }} />
                <h3>Processing with Cloudinary AI</h3>
                <div className="processing-steps">
                  {PROCESSING_STEPS.map((label, i) => (
                    <div
                      key={i}
                      className={`proc-step ${i === procStep ? 'active' : i < procStep ? 'active' : ''}`}
                      style={{ opacity: i <= procStep ? 1 : 0.4 }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Done ── */}
          {scanState === 'done' && (
            <div className="done-state">
              <div className="done-icon" style={{ color: serviceColor }}>
                ✓
              </div>
              <p>Selfie processed successfully</p>
            </div>
          )}

          {/* ── Error ── */}
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

        {/* ── Tips sidebar ── */}
        <div className="face-scan-tips">
          <h4>For the best scan</h4>
          <ul>
            <li>
              <span className="tip-icon">☀️</span> Sit in a well-lit area, facing a light source
            </li>
            <li>
              <span className="tip-icon">👀</span> Look directly at the camera lens
            </li>
            <li>
              <span className="tip-icon">😐</span> Keep a neutral expression
            </li>
            <li>
              <span className="tip-icon">🚫</span> Remove glasses, hats, or face coverings
            </li>
            <li>
              <span className="tip-icon">📱</span> Hold the device steady at eye level
            </li>
          </ul>

          <div className="cloudinary-badge">
            <span className="cloudinary-badge-icon">☁️</span>
            <div>
              <strong>Cloudinary AI Processing</strong>
              <p>
                Your selfie is automatically face-cropped, enhanced, and sharpened using
                Cloudinary's AI transformation pipeline.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="step-actions">
        <button className="btn-step-secondary" onClick={onBack}>
          ← Back
        </button>
      </div>
    </div>
  );
}