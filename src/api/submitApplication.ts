// submitApplication.ts

import type { ServiceId, UploadedFile } from '../types';

export interface SubmitApplicationPayload {
  serviceId: ServiceId;
  files: UploadedFile[];
}

export interface SubmitApplicationResponse {
  referenceNumber: string;
}

/**
 * Submits a completed document package to the Service Canada backend.
 *
 * Currently simulated with a delay. Replace the body of this function
 * with a real fetch() call when the backend is ready — callers don't
 * need to change.
 *
 * @throws {Error} if the submission fails
 */
export async function submitApplication(
  payload: SubmitApplicationPayload,
): Promise<SubmitApplicationResponse> {
  // ─── Simulated network call ──────────────────────────────────────────────
  // Replace this block with:
  //   const res = await fetch('/api/submit', { method: 'POST', body: JSON.stringify(payload) });
  //   if (!res.ok) throw new Error(await res.text());
  //   return res.json();
  await new Promise<void>((resolve) => setTimeout(resolve, 1200));

  const referenceNumber = `SC-${Date.now().toString(36).toUpperCase()}`;
  return { referenceNumber };
  // ─────────────────────────────────────────────────────────────────────────
}