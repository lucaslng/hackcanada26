// useFaceVerification.ts
// Compares two Cloudinary-transformed image URLs using resemble.js.

import { useCallback, useRef, useState } from 'react';
// import { ssim } from 'ssim.js';
import resemble from 'resemblejs';

export type FaceVerifyStatus =
    | 'idle'
    | 'analyzing'
    | 'done'
    | 'error';

export interface FaceVerifyResult {
    status: FaceVerifyStatus;
    /** 0-100 similarity score, present when status is 'done' */
    similarity: number | null;
    /** Resemble score from 0-1 (higher = more similar) */
    score: number | null;
    /** Human-readable message */
    message: string;
    /** true if same person (score >= threshold) */
    passed: boolean;
}

const PASS_THRESHOLD = 0.62;
const COMPARISON_CANVAS_SIZE = 256;

/**
 * Fetch an image from a URL.
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

function toDataUrl(img: HTMLImageElement, size: number): string {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to create 2D canvas context for comparison.');
    ctx.drawImage(img, 0, 0, size, size);
    return canvas.toDataURL('image/jpeg', 0.92);
}

function compareWithResemble(firstDataUrl: string, secondDataUrl: string): Promise<number> {
    return new Promise((resolve, reject) => {
        resemble(firstDataUrl)
            .compareTo(secondDataUrl)
            .ignoreAntialiasing()
            .onComplete((data: { misMatchPercentage?: string }) => {
                const mismatch = Number.parseFloat(data.misMatchPercentage ?? '');
                if (Number.isNaN(mismatch)) {
                    reject(new Error('Resemble returned an invalid mismatch percentage.'));
                    return;
                }
                const similarity = Math.max(0, 1 - mismatch / 100);
                resolve(similarity);
            });
    });
}

/**
 * Apply face-enhancing Cloudinary transformations to a public_id.
 * This normalizes lighting, upscales, sharpens, and face-crops both images
 * to the same 400x400 canvas before resemble.js comparison.
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
        score: null,
        message: '',
        passed: false,
    });

    const runningRef = useRef(false);

    const verify = useCallback(
        async (idPublicId: string, selfiePublicId: string) => {
            if (runningRef.current) return;
            runningRef.current = true;

            // ── Step 1: Preprocess via Cloudinary ───────────────────────────
            setResult({ status: 'analyzing', similarity: null, score: null, message: 'Enhancing images with Cloudinary…', passed: false });

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
                    score: null,
                    message: `Could not load images for comparison: ${err instanceof Error ? err.message : 'network error'}`,
                    passed: false,
                });
                runningRef.current = false;
                return;
            }

            // ── Step 2: Compute resemble.js similarity ───────────────────────
            let score: number;
            try {
                const idDataUrl = toDataUrl(idImg, COMPARISON_CANVAS_SIZE);
                const selfieDataUrl = toDataUrl(selfieImg, COMPARISON_CANVAS_SIZE);
                score = await compareWithResemble(idDataUrl, selfieDataUrl);
                // const idData = toImageData(idImg, COMPARISON_CANVAS_SIZE);
                // const selfieData = toImageData(selfieImg, COMPARISON_CANVAS_SIZE);
                // const { mssim } = ssim(idData, selfieData);
                // score = mssim;
            } catch (err) {
                setResult({
                    status: 'error',
                    similarity: null,
                    score: null,
                    message: `Resemble.js comparison failed: ${err instanceof Error ? err.message : 'unknown error'}`,
                    passed: false,
                });
                runningRef.current = false;
                return;
            }

            const similarity = Math.round(score * 100);
            const passed = score >= PASS_THRESHOLD;

            setResult({
                status: 'done',
                similarity,
                score: Math.round(score * 1000) / 1000,
                message: passed
                    ? 'Image structures are consistent across your ID and selfie.'
                    : `The ID and selfie are not structurally similar enough. Score: ${score.toFixed(3)}`,
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
