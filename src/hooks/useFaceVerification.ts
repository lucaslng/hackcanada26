// useFaceVerification.ts
// Compares two Cloudinary-transformed image URLs using face-api.js.
// face-api.js extracts 128-dimensional face descriptors via a neural network
// and computes Euclidean distance — giving genuine facial similarity scores
// rather than pixel-level comparison.
//
// Install:  npm install face-api.js
// Models are loaded from the official jsDelivr CDN (no local assets needed).

import { useCallback, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

// ── Types ─────────────────────────────────────────────────────────────────────

export type FaceVerifyStatus = 'idle' | 'loading-models' | 'analyzing' | 'done' | 'error';

export interface FaceVerifyResult {
  status: FaceVerifyStatus;
  /** 0–100 similarity percentage, present when status is 'done' */
  similarity: number | null;
  /** Raw Euclidean distance between face descriptors (lower = more similar) */
  score: number | null;
  /** Human-readable message */
  message: string;
  /** true if faces match (distance ≤ PASS_THRESHOLD) */
  passed: boolean;
}

// ── Constants ─────────────────────────────────────────────────────────────────

/**
 * face-api.js face recognition networks use a 128-D descriptor.
 * Euclidean distance ≤ 0.55 is a strong match; ≤ 0.6 is the default threshold.
 * We use 0.55 for tighter accuracy.
 */
const PASS_THRESHOLD = 0.55;

/**
 * Maximum meaningful Euclidean distance for display purposes.
 * Distances above ~1.2 are effectively "no match".
 */
const MAX_DISPLAY_DISTANCE = 1.2;

/** Official model weights hosted on jsDelivr — no local files needed. */
const MODEL_URL =
  'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights';

// ── Module-level model cache ──────────────────────────────────────────────────

let modelsLoaded = false;
let modelLoadPromise: Promise<void> | null = null;

async function ensureModelsLoaded(): Promise<void> {
  if (modelsLoaded) return;
  if (modelLoadPromise) return modelLoadPromise;

  modelLoadPromise = Promise.all([
    // SSD MobileNet v1 — face detection
    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    // 68-point face landmark model — required before face recognition
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    // Face recognition net — produces 128-D descriptor
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ]).then(() => {
    modelsLoaded = true;
    modelLoadPromise = null;
  });

  return modelLoadPromise;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Load an HTMLImageElement from a URL, with CORS + cache-busting. */
async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = `${url}${url.includes('?') ? '&' : '?'}_cb=${Date.now()}`;
  });
}

/**
 * Convert Euclidean distance (0 = identical, ~1.2 = very different)
 * to a 0–100 integer similarity score for display.
 */
function distanceToSimilarity(distance: number): number {
  return Math.max(0, Math.round((1 - distance / MAX_DISPLAY_DISTANCE) * 100));
}

/**
 * Apply Cloudinary face-crop + normalise transform before sending to the model.
 * Consistent framing (g_face, 400×400) significantly improves accuracy.
 */
export function buildFaceUrl(cloudName: string, publicId: string): string {
  return (
    `https://res.cloudinary.com/${cloudName}/image/upload/` +
    `c_fill,g_face,w_400,h_400,e_improve,e_sharpen:40,q_auto,f_jpg/` +
    publicId
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useFaceVerification(cloudName: string) {
  const [result, setResult] = useState<FaceVerifyResult>({
    status: 'idle',
    similarity: null,
    score: null,
    message: '',
    passed: false,
  });

  const runningRef = useRef(false);

  const verify = useCallback(
    async (idPublicId: string, selfiePublicId: string) => {
      if (runningRef.current) return;
      runningRef.current = true;

      // ── Step 1: Load face-api.js models (cached after first call) ──────────
      setResult({
        status: 'loading-models',
        similarity: null,
        score: null,
        message: 'Loading face recognition models…',
        passed: false,
      });

      try {
        await ensureModelsLoaded();
      } catch (err) {
        setResult({
          status: 'error',
          similarity: null,
          score: null,
          message: `Failed to load face recognition models: ${
            err instanceof Error ? err.message : 'network error'
          }`,
          passed: false,
        });
        runningRef.current = false;
        return;
      }

      // ── Step 2: Load & Cloudinary-enhance images ───────────────────────────
      setResult({
        status: 'analyzing',
        similarity: null,
        score: null,
        message: 'Enhancing images with Cloudinary…',
        passed: false,
      });

      const idUrl = buildFaceUrl(cloudName, idPublicId);
      const selfieUrl = buildFaceUrl(cloudName, selfiePublicId);

      let idImg: HTMLImageElement;
      let selfieImg: HTMLImageElement;

      try {
        [idImg, selfieImg] = await Promise.all([
          loadImage(idUrl),
          loadImage(selfieUrl),
        ]);
      } catch (err) {
        setResult({
          status: 'error',
          similarity: null,
          score: null,
          message: `Could not load images: ${
            err instanceof Error ? err.message : 'network error'
          }`,
          passed: false,
        });
        runningRef.current = false;
        return;
      }

      // ── Step 3: Detect faces and extract descriptors ───────────────────────
      setResult((prev) => ({ ...prev, message: 'Detecting faces and extracting descriptors…' }));

      let idDetection: faceapi.WithFaceDescriptor<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection; }, faceapi.FaceLandmarks68>> | undefined = undefined;

      let selfieDetection: faceapi.WithFaceDescriptor<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection; }, faceapi.FaceLandmarks68>> | undefined = undefined;

      try {
        [idDetection, selfieDetection] = await Promise.all([
          faceapi
            .detectSingleFace(idImg, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
            .withFaceLandmarks()
            .withFaceDescriptor(),
          faceapi
            .detectSingleFace(selfieImg, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
            .withFaceLandmarks()
            .withFaceDescriptor(),
        ]);
      } catch (err) {
        setResult({
          status: 'error',
          similarity: null,
          score: null,
          message: `Face detection error: ${
            err instanceof Error ? err.message : 'unknown error'
          }`,
          passed: false,
        });
        runningRef.current = false;
        return;
      }

      // ── Step 4: Validate detections ────────────────────────────────────────
      if (!idDetection) {
        setResult({
          status: 'error',
          similarity: null,
          score: null,
          message:
            'No face detected in the ID document. Please upload a clear photo that shows a visible face.',
          passed: false,
        });
        runningRef.current = false;
        return;
      }

      if (!selfieDetection) {
        setResult({
          status: 'error',
          similarity: null,
          score: null,
          message:
            'No face detected in the selfie. Please retake the photo in good lighting, facing the camera directly.',
          passed: false,
        });
        runningRef.current = false;
        return;
      }

      // ── Step 5: Compute Euclidean distance between descriptors ─────────────
      const distance = faceapi.euclideanDistance(
        idDetection.descriptor,
        selfieDetection.descriptor,
      );

      const similarity = distanceToSimilarity(distance);
      const roundedDistance = Math.round(distance * 1000) / 1000;
      const passed = distance <= PASS_THRESHOLD;

      setResult({
        status: 'done',
        similarity,
        score: roundedDistance,
        message: passed
          ? `Face descriptors match with high confidence (distance ${roundedDistance}).`
          : `Face descriptors do not match closely enough (distance ${roundedDistance}, threshold ${PASS_THRESHOLD}).`,
        passed,
      });

      runningRef.current = false;
    },
    [cloudName],
  );

  const reset = useCallback(() => {
    runningRef.current = false;
    setResult({ status: 'idle', similarity: null, score: null, message: '', passed: false });
  }, []);

  return { result, verify, reset };
}