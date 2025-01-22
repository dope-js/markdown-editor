import {
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react';
import clsx from 'clsx';
import type { FC } from 'react';
import { useState } from 'react';
import { IconUpload } from '../icons';

import './image.scss';
import { PreviewImage } from './preview-img';

interface ImageProps {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
  title?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
}

export const Image: FC<ImageProps> = ({ src, width, height, alt, title, crossOrigin }) => {
  const [loadStatus, setLoadStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  const dismiss = useDismiss(context, { outsidePressEvent: 'mousedown' });
  const click = useClick(context, { enabled: loadStatus === 'success' });

  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, click]);

  return (
    <div className="dme-image">
      <img
        src={src}
        width={width}
        height={height}
        title={title}
        alt={alt}
        crossOrigin={crossOrigin}
        ref={refs.setReference}
        className={clsx('dme-image-img', { 'dme-image-img-preview': loadStatus === 'success' })}
        onLoad={() => setLoadStatus('success')}
        onError={() => setLoadStatus('error')}
        {...getReferenceProps()}
      />
      {loadStatus !== 'success' && (
        <div className="dme-image-img-overlay">
          {loadStatus === 'loading' && <div className="dme-image-img-loading"></div>}
          {loadStatus === 'error' && (
            <div className="dme-image-img-error">
              <IconUpload />
            </div>
          )}
        </div>
      )}
      {loadStatus === 'success' && isOpen && (
        <FloatingPortal root={document.body}>
          <FloatingOverlay className={clsx('dme-image-preview-overlay')} lockScroll>
            <div className="dme-image-preview" ref={refs.setFloating} {...getFloatingProps()}>
              <PreviewImage src={src} zoom={zoom} onZoom={setZoom} hide={() => setIsOpen(false)} />
            </div>
          </FloatingOverlay>
        </FloatingPortal>
      )}
    </div>
  );
};
