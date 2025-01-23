import { useEffect, useState, type FC } from 'react';
import { byteKB, byteMB } from './constants';
import { IconAlertCircle } from '../ui';

interface ICardProps {
  file: File;
  message: string;
  progress?: number;
}

function getFileSize(number: number): string {
  if (number < byteKB) {
    return `${(number / byteKB).toFixed(2)}KB`;
  } else if (number >= byteKB && number < byteMB) {
    return `${(number / byteKB).toFixed(1)}KB`;
  } else if (number >= byteMB) {
    return `${(number / byteMB).toFixed(1)}MB`;
  }
  return number.toString();
}

export const Card: FC<ICardProps> = ({ file, message, progress = 0 }) => {
  const [src, setSrc] = useState('');

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => {
      setSrc(reader.result as string);
    };

    reader.readAsDataURL(file);
  }, [file]);

  return (
    <div className="dme-upload-file-card">
      <div className="dme-upload-file-card-preview">
        <img src={src} />
      </div>
      <div className="dme-upload-file-card-main">
        <div className="dme-upload-file-card-info">
          <div className="dme-upload-file-card-info-name">{file.name}</div>
          <div className="dme-upload-file-card-info-size">{getFileSize(file.size)}</div>
        </div>
        {message ? (
          <div className="dme-upload-file-card-message">
            <IconAlertCircle size="small" />
            <span>{message}</span>
          </div>
        ) : progress < 1 ? (
          <div className="dme-upload-file-card-progress">
            <div className="dme-upload-file-card-progress-track">
              <div className="dme-upload-file-card-progress-track-inner" style={{ width: `${progress * 100}%` }}></div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
