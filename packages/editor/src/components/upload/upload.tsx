import { useEditor } from '@/contexts';
import type { HandleUploadArgs, HandleUploadFn } from '@/types';
import { noop } from '@/utils';
import clsx from 'clsx';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { IconUpload } from '../ui';
import { Card } from './card';
import { useDrag } from './hooks';

import './upload.scss';

enum DragStatus {
  Normal,
  Legal,
  Illegal,
}

interface IUploadProps {
  maxSize?: number;
  handleUpload?: HandleUploadFn;
  onUploaded?: (args: { url: string; width?: number; height?: number; file: File }) => void;
}

export const Upload: FC<IUploadProps> = ({ maxSize, handleUpload = noop, onUploaded = noop }) => {
  const { t } = useEditor();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!selectedFile) return;
    setMessage('');

    if (maxSize && selectedFile.size > maxSize * 1024 * 1024) {
      setMessage(t('image.upload.error.size', { filename: selectedFile.name, maxSize: `${maxSize}MB` }));
      return;
    }

    const uploadArgs: HandleUploadArgs = {
      file: selectedFile,
      onSuccess: (args) => {
        setProgress(1);
        onUploaded({ ...args, file: selectedFile });
      },
      onError: (error) => {
        setMessage(error ?? '');
      },
      onProgress: (progress) => {
        if (progress < 0) setProgress(0);
        else if (progress > 1) setProgress(1);
        else setProgress(progress);
      },
    };

    handleUpload(uploadArgs);
  }, [selectedFile, setMessage, onUploaded, setProgress]);

  const { status, tip, handleDragEnter, handleDragLeave, handleDragOver, handleDrop } = useDrag(t, setSelectedFile);

  return (
    <div className="dme-upload">
      <input
        ref={inputRef}
        className="dme-upload-hidden-input"
        accept="image/*"
        type="file"
        autoComplete="off"
        tabIndex={-1}
        onChange={(e) => {
          if (!e.target.files || e.target.files.length === 0) return;
          if (e.target.files.length === 2) return;

          const file = e.target.files[0];
          if (!file.type.startsWith('image/')) {
            return;
          }
          setSelectedFile(file);
        }}
      />
      <div
        className={clsx('dme-upload-dragarea', {
          'dme-upload-dragarea-legal': status === DragStatus.Legal,
          'dme-upload-dragarea-illegal': status === DragStatus.Illegal,
        })}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        <div className="dme-upload-dragarea-icon">
          <IconUpload />
        </div>
        <span className="dme-upload-dragarea-text">{t('upload.description')}</span>
        {status !== DragStatus.Normal && (
          <span
            className={clsx('dme-upload-dragarea-tip', {
              'dme-upload-dragarea-tip-legal': status === DragStatus.Legal,
              'dme-upload-dragarea-tip-illegal': status === DragStatus.Illegal,
            })}
          >
            {tip}
          </span>
        )}
      </div>
      {selectedFile && (
        <div className="dme-upload-file">
          <Card file={selectedFile} message={message} progress={progress} />
        </div>
      )}
    </div>
  );
};
