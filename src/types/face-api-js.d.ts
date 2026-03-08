declare module 'face-api.js' {
  export interface FaceDetection {
    score?: number;
  }

  export interface FaceLandmarks68 {
    positions?: Array<{ x: number; y: number }>;
  }

  export type WithFaceLandmarks<T, L> = T & { landmarks: L };
  export type WithFaceDescriptor<T> = T & { descriptor: Float32Array };

  export class SsdMobilenetv1Options {
    constructor(options?: { minConfidence?: number });
  }

  export const nets: {
    ssdMobilenetv1: { loadFromUri: (uri: string) => Promise<void> };
    faceLandmark68Net: { loadFromUri: (uri: string) => Promise<void> };
    faceRecognitionNet: { loadFromUri: (uri: string) => Promise<void> };
  };

  interface DetectSingleFaceTask {
    withFaceLandmarks(): {
      withFaceDescriptor(): Promise<
        | WithFaceDescriptor<WithFaceLandmarks<{ detection: FaceDetection }, FaceLandmarks68>>
        | undefined
      >;
    };
  }

  export function detectSingleFace(
    input: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
    options?: SsdMobilenetv1Options,
  ): DetectSingleFaceTask;

  export function euclideanDistance(
    arr1: Float32Array | number[],
    arr2: Float32Array | number[],
  ): number;
}
