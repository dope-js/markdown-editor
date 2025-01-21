import type { FC } from 'react';
import { useMemo, useRef } from 'react';
import { useImageOffset, useImageSize } from './hooks';

export interface ImageOffset {
  x: number;
  y: number;
}

interface IPreviewImageProps {
  src: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
  rotation?: number;
  zoom?: number;
  onZoom?: (zoom: number) => void;
  zoomStep?: number;
  maxZoom?: number;
  minZoom?: number;
  hide: () => void;
}

export const PreviewImage: FC<IPreviewImageProps> = ({
  src,
  crossOrigin,
  rotation = 0,
  zoom = 1,
  onZoom,
  zoomStep = 0.1,
  maxZoom = 3,
  minZoom = 0.1,
  hide,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const isVertical = useMemo(() => rotation % 180 !== 0, [rotation]);

  const { loading, size, containerReact, imageRect, handleLoad, handleWheel, canDrag } = useImageSize({
    container: containerRef,
    image: imageRef,
    isVertical,
    zoom,
    onZoom,
    zoomStep,
    maxZoom,
    minZoom,
  });

  const { top, left, handleMoveImage, handleMoveStart, handleMoveEnd, isDragging } = useImageOffset({
    size,
    container: containerRef,
    containerReact,
    imageRect,
    isVertical,
    canDrag,
  });

  return (
    <div
      className="dme-image-preview-image"
      ref={containerRef}
      onClick={() => {
        if (!isDragging) hide();
      }}
    >
      <img
        crossOrigin={crossOrigin}
        ref={imageRef}
        src={src}
        style={{
          top,
          left,
          position: 'absolute',
          transform: `rotate(${-rotation}deg)`,
          width: loading ? 'auto' : `${size.width}px`,
          height: loading ? 'auto' : `${size.height}px`,
        }}
        onClick={(e) => e.stopPropagation()}
        onLoad={handleLoad}
        onMouseMove={handleMoveImage}
        onMouseMoveCapture={handleMoveImage}
        onMouseDown={handleMoveStart}
        onMouseUp={handleMoveEnd}
        onMouseUpCapture={handleMoveEnd}
        onWheel={handleWheel}
      />
    </div>
  );
};
