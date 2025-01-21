import type { TranslateFn } from '@/types';
import type { DragEvent } from 'react';
import { useCallback, useState } from 'react';

export enum DragStatus {
  Normal,
  Legal,
  Illegal,
}

export function useDrag(t: TranslateFn, setSelectedFile: (file: File | undefined) => void) {
  const [status, setStatus] = useState<DragStatus>(DragStatus.Normal);
  const [tip, setTip] = useState('');

  const handleDragEnter = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setTip(t('upload.tip.legal'));
      setStatus(DragStatus.Legal);

      if (e.dataTransfer.files.length === 0) return;

      if (e.dataTransfer.files.length > 1) {
        setTip(t('upload.tip.illegal.multiple'));
        setStatus(DragStatus.Illegal);
        return;
      }

      if (e.dataTransfer.files[0].type.startsWith('image/')) {
        setTip(t('upload.tip.illegal.type'));
        setStatus(DragStatus.Legal);
        return;
      }

      setStatus(DragStatus.Illegal);
    },
    [setStatus, t]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setStatus(DragStatus.Normal);
    },
    [setStatus]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setStatus(DragStatus.Normal);
      if (e.dataTransfer.files.length === 0) return;
      if (e.dataTransfer.files.length > 1) return;

      const selectedFile = e.dataTransfer.files[0];
      if (!selectedFile.type.startsWith('image/')) {
        return;
      }

      setSelectedFile(selectedFile);
    },
    [setStatus, setSelectedFile]
  );

  return { status, tip, handleDragEnter, handleDragOver, handleDragLeave, handleDrop };
}
