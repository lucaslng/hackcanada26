// useDocumentUpload.ts

import { useCallback, useState } from 'react';
import type { CloudinaryUploadResult } from '../cloudinary/UploadWidget';
import type { RequiredDoc, UploadedFile } from '../types';

interface UseDocumentUploadReturn {
  uploads: Record<string, UploadedFile>;
  activeDoc: string | null;
  progress: number;
  completedCount: number;
  totalCount: number;
  requiredComplete: boolean;
  setActiveDoc: (id: string | null) => void;
  handleUploadSuccess: (result: CloudinaryUploadResult, docId: string, docLabel: string) => void;
}

export function useDocumentUpload(docs: RequiredDoc[]): UseDocumentUploadReturn {
  const [uploads, setUploads] = useState<Record<string, UploadedFile>>({});
  const [activeDoc, setActiveDoc] = useState<string | null>(null);

  const completedCount = Object.keys(uploads).length;
  const totalCount = docs.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const requiredComplete = docs
    .filter((d) => d.required)
    .every((d) => d.id in uploads);

  const handleUploadSuccess = useCallback(
    (result: CloudinaryUploadResult, docId: string, docLabel: string) => {
      setUploads((prev) => ({
        ...prev,
        [docId]: {
          docId,
          docLabel,
          publicId: result.public_id,
          secureUrl: result.secure_url,
        },
      }));
      setActiveDoc(null);
    },
    [],
  );

  return {
    uploads,
    activeDoc,
    progress,
    completedCount,
    totalCount,
    requiredComplete,
    setActiveDoc,
    handleUploadSuccess,
  };
}