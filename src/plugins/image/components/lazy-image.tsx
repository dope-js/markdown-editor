import type { FC } from 'react';

const imageCache = new Set();

function useSuspenseImage(src: string) {
  if (!imageCache.has(src)) {
    throw new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onerror = img.onload = () => {
        imageCache.add(src);
        resolve(null);
      };
    });
  }
}

interface ILazyImageProps {
  title: string;
  alt: string;
  className: string | null;
  imageRef: { current: null | HTMLImageElement };
  src: string;
  width: number | 'inherit';
  height: number | 'inherit';
}

export const LazyImage: FC<ILazyImageProps> = ({ title, alt, className, imageRef, src, width, height }) => {
  useSuspenseImage(src);
  return <img className={className ?? undefined} alt={alt} src={src} title={title} ref={imageRef} draggable="false" width={width} height={height} />;
};
