// UploadWidget.tsx

import { useEffect, useRef, useState } from 'react';
import { uploadPreset } from './config';

// Global declaration lives in src/types/globals.d.ts
// Importing it here ensures the declaration is applied in this module too.
import '../types/globals.d';

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
  created_at: string;
}

interface UploadWidgetProps {
  onUploadSuccess?: (result: CloudinaryUploadResult) => void;
  onUploadError?: (error: Error) => void;
  buttonText?: string;
  className?: string;
}

export function UploadWidget({
  onUploadSuccess,
  onUploadError,
  buttonText = 'Upload Image',
  className = 'ui-btn ui-btn--primary',
}: UploadWidgetProps) {
  const widgetRef = useRef<{ open: () => void } | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  // Keep latest callbacks in refs so the widget closure never goes stale.
  // This avoids re-creating the widget every time a parent re-renders.
  const onSuccessRef = useRef(onUploadSuccess);
  const onErrorRef = useRef(onUploadError);
  useEffect(() => { onSuccessRef.current = onUploadSuccess; }, [onUploadSuccess]);
  useEffect(() => { onErrorRef.current = onUploadError; }, [onUploadError]);

  useEffect(() => {
    let poll: ReturnType<typeof setInterval> | null = null;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let mounted = true;

    function isWidgetReady(): boolean {
      return typeof window.cloudinary?.createUploadWidget === 'function';
    }

    function initializeWidget() {
      if (!mounted || !isWidgetReady()) return;

      if (!uploadPreset) {
        console.warn(
          'VITE_CLOUDINARY_UPLOAD_PRESET is not set. ' +
          'Create an unsigned upload preset in your Cloudinary dashboard.',
        );
      }

      widgetRef.current = window.cloudinary!.createUploadWidget(
        {
          cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
          uploadPreset: uploadPreset || undefined,
          sources: ['local', 'camera', 'url'],
          multiple: false,
        },
        (error, result) => {
          if (error) {
            console.error('Upload error:', error);
            onErrorRef.current?.(new Error(error.message ?? 'Upload failed'));
            return;
          }
          if (result?.event === 'success') {
            onSuccessRef.current?.(result.info as unknown as CloudinaryUploadResult);
          }
        },
      );

      if (mounted) setIsReady(true);
    }

    // Check immediately in case the script already loaded
    if (isWidgetReady()) {
      initializeWidget();
    } else {
      // Poll every 100 ms until createUploadWidget is attached
      poll = setInterval(() => {
        if (isWidgetReady()) {
          clearInterval(poll!);
          clearTimeout(timeout!);
          initializeWidget();
        }
      }, 100);

      // Give up after 10 s and surface an error
      timeout = setTimeout(() => {
        if (poll) clearInterval(poll);
        if (mounted && !isWidgetReady()) {
          console.error('Upload widget script failed to load within 10 seconds');
          setScriptError(true);
        }
      }, 10_000);
    }

    return () => {
      mounted = false;
      if (poll) clearInterval(poll);
      if (timeout) clearTimeout(timeout);
    };
  }, []); // intentionally empty — callbacks are stable via refs

  const handleClick = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    } else if (!scriptError) {
      console.warn('Upload widget is still loading — please try again shortly.');
    }
  };

  if (scriptError) {
    return (
      <div style={{ color: '#dc2626', fontSize: '0.875rem' }}>
        Upload widget failed to load. Please refresh the page or check your network connection.
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isReady}
      className={className}
      style={{ cursor: isReady ? 'pointer' : 'wait' }}
    >
      {isReady ? buttonText : 'Loading…'}
    </button>
  );
}
