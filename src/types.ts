export interface CapturedPhoto {
  publicId: string;
  transformedUrl: string;
}

export interface VerificationResult {
  passed: boolean;
  confidence: number;
  message: string;
}
