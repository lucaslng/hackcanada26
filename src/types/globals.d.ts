// globals.d.ts

/**
 * Cloudinary Upload Widget global — injected by the script in index.html.
 * Declared here once so it doesn't need to be re-declared in every component.
 */
declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        config: Record<string, unknown>,
        callback: (
          error: { message?: string } | null,
          result: { event: string; info: Record<string, unknown> } | null,
        ) => void,
      ) => { open: () => void };
    };
  }
}

declare module 'resemblejs';

export {};
