// useFaceVerification.ts
// Loads face-api.js models once, then runs real 1:1 face comparison
// between two Cloudinary-transformed image URLs.

import { useCallback, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

export type FaceVerifyStatus =
    | 'idle'
    | 'loading-models'
    | 'analyzing'
    | 'done'
    | 'no-face-id'
    | 'no-face-selfie'
    | 'error';

export interface FaceVerifyResult {
    status: FaceVerifyStatus;
    /** 0-100 similarity score, present when status is 'done' */
    similarity: number | null;
    /** Euclidean distance from face-api (lower = more similar, < 0.6 = same person) */
    distance: number | null;
    /** Human-readable message */
    message: string;
    /** true if same person (distance < 0.55 threshold) */
    passed: boolean;
}

const MODELS_URL = '/models';
// face-api euclidean distance thresholds (FaceNet style):
//   < 0.40 → very confident same person
//   < 0.55 → confident same person  ← we use this as pass threshold
//   > 0.60 → likely different people
const PASS_THRESHOLD = 0.55;

let modelsLoaded = false; // module-level singleton so we only load once
let loadingPromise: Promise<void> | null = null;

async function ensureModelsLoaded() {
    if (modelsLoaded) return;
    if (loadingPromise) return loadingPromise;

    loadingPromise = (async () => {
        await Promise.all([
            faceapi.nets.ssdMobilenetv1.loadFromUri(MODELS_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_URL),
        ]);
        modelsLoaded = true;
    })();

    return loadingPromise;
}

/**
 * Fetch an image from a URL — with a CORS proxy workaround for Cloudinary.
 * Cloudinary URLs already support CORS so we can fetch them directly.
 */
async function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        // Cache-bust to avoid CORS preflight cache issues
        img.src = url + (url.includes('?') ? '&' : '?') + '_cb=' + Date.now();
    });
}

/**
 * Apply face-enhancing Cloudinary transformations to a public_id.
 * This normalises lighting, upscales, sharpens, and face-crops both images
 * to the same 400×400 canvas before face-api.js processes them.
 */
export function buildFaceUrl(cloudName: string, publicId: string): string {
    return (
        `https://res.cloudinary.com/${cloudName}/image/upload/` +
        `c_fill,g_face,w_400,h_400,e_sharpen:60,e_improve,q_auto,f_jpg/` +
        publicId
    );
}

export function useFaceVerification(cloudName: string) {
    const [result, setResult] = useState<FaceVerifyResult>({
        status: 'idle',
        similarity: null,
        distance: null,
        message: '',
        passed: false,
    });

    const runningRef = useRef(false);

    const verify = useCallback(
        async (idPublicId: string, selfiePublicId: string) => {
            if (runningRef.current) return;
            runningRef.current = true;

            // ── Step 1: Load models ──────────────────────────────────────────
            setResult({ status: 'loading-models', similarity: null, distance: null, message: 'Loading face recognition models…', passed: false });

            try {
                await ensureModelsLoaded();
            } catch {
                setResult({ status: 'error', similarity: null, distance: null, message: 'Failed to load face recognition models. Please refresh.', passed: false });
                runningRef.current = false;
                return;
            }

            // ── Step 2: Preprocess via Cloudinary ───────────────────────────
            setResult({ status: 'analyzing', similarity: null, distance: null, message: 'Enhancing images with Cloudinary…', passed: false });

            const idUrl = buildFaceUrl(cloudName, idPublicId);
            const selfieUrl = buildFaceUrl(cloudName, selfiePublicId);

            let idImg: HTMLImageElement;
            let selfieImg: HTMLImageElement;

            try {
                [idImg, selfieImg] = await Promise.all([
                    loadImageFromUrl(idUrl),
                    loadImageFromUrl(selfieUrl),
                ]);
            } catch (err) {
                setResult({
                    status: 'error',
                    similarity: null,
                    distance: null,
                    message: `Could not load images for comparison: ${err instanceof Error ? err.message : 'network error'}`,
                    passed: false,
                });
                runningRef.current = false;
                return;
            }

            // ── Step 3: Detect faces + extract 128-d descriptors ────────────
            setResult({ status: 'analyzing', similarity: null, distance: null, message: 'Detecting facial features…', passed: false });

            let face1: faceapi.WithFaceDescriptor<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }>> | undefined;
            let face2: typeof face1;

            try {
                [face1, face2] = await Promise.all([
                    faceapi.detectSingleFace(idImg).withFaceLandmarks().withFaceDescriptor(),
                    faceapi.detectSingleFace(selfieImg).withFaceLandmarks().withFaceDescriptor(),
                ]);
            } catch (err) {
                setResult({ status: 'error', similarity: null, distance: null, message: `Face detection failed: ${err instanceof Error ? err.message : 'unknown error'}`, passed: false });
                runningRef.current = false;
                return;
            }

            if (!face1) {
                setResult({ status: 'no-face-id', similarity: null, distance: null, message: 'No face detected in your ID photo. Please retake your ID photo with your face clearly visible.', passed: false });
                runningRef.current = false;
                return;
            }
            if (!face2) {
                setResult({ status: 'no-face-selfie', similarity: null, distance: null, message: 'No face detected in your selfie. Please retake your selfie with your face centred and well-lit.', passed: false });
                runningRef.current = false;
                return;
            }

            // ── Step 4: Compute similarity ───────────────────────────────────
            const distance = faceapi.euclideanDistance(face1.descriptor, face2.descriptor);
            // Convert distance [0..2] to a 0–100% similarity score
            // Distance 0 = identical, distance ≥ 1 = clearly different
            const similarity = Math.max(0, Math.round((1 - distance) * 100));
            const passed = distance < PASS_THRESHOLD;

            setResult({
                status: 'done',
                similarity,
                distance: Math.round(distance * 1000) / 1000,
                message: passed
                    ? `Facial geometry and biometric markers are consistent across both images.`
                    : `The facial features in your ID and selfie do not match closely enough. Distance: ${(distance).toFixed(3)}`,
                passed,
            });

            runningRef.current = false;
        },
        [cloudName],
    );

    const reset = useCallback(() => {
        runningRef.current = false;
        setResult({ status: 'idle', similarity: null, distance: null, message: '', passed: false });
    }, []);

    return { result, verify, reset };
}
