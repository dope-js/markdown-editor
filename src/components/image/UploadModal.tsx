import { useEditor } from '@/contexts';
import { insertImage$ } from '@/plugins';
import { usePublisher } from '@mdxeditor/gurx';
import { useState, type FC } from 'react';
import { Input, Modal } from '../ui';
import { Upload } from '../upload';

import './modal.scss';

interface IUploadModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export function getImageSize(file: File | undefined) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    if (!file) return reject(new Error('file is undefined'));

    if (!file.type.startsWith('image/')) return reject(new Error('file is not image'));

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const { width, height } = img;
      resolve({ width, height });
    };

    img.onerror = (e) => {
      reject(e);
    };
  });
}

export const UploadModal: FC<IUploadModalProps> = ({ visible, setVisible }) => {
  const { t, handleUpload } = useEditor();
  const [src, setSrc] = useState('');
  const [imageWidth, setImageWidth] = useState<number>();
  const [imageHeight, setImageHeight] = useState<number>();
  const [imageTitle, setImageTitle] = useState<string>();

  const maxSize = 5;
  const insertImage = usePublisher(insertImage$);

  return (
    <Modal
      title={t('image.upload.title')}
      visible={visible}
      onVisibleChange={setVisible}
      okButtonProps={{ disabled: !src || !imageTitle }}
      onOk={() => {
        if (!src) return;
        insertImage({ altText: imageTitle ?? 'Image', src, width: imageWidth, height: imageHeight });
        setVisible(false);
      }}
    >
      <div className="dme-image-form">
        <div className="dme-image-form-field">
          <div className="dme-image-form-field__label">{t('image.upload.select_file')}</div>
          <div className="dme-image-form-field__main">
            <Upload
              maxSize={maxSize}
              handleUpload={handleUpload}
              onUploaded={(args) => {
                setSrc(args.url);
                setImageWidth(args.width);
                setImageHeight(args.height);
                setImageTitle(args.file.name);
              }}
            />
          </div>
        </div>
        <div className="dme-image-form-field">
          <div className="dme-image-form-field__label">{t('image.title.label')}</div>
          <div className="dme-image-form-field__main">
            <Input value={imageTitle} onChange={setImageTitle} />
          </div>
        </div>
      </div>
    </Modal>
  );
};
