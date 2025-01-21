import { Image as ImageComp } from '@/components';
import type { FC } from 'react';

export const Image: FC<{
  width: number;
  height: number;
  src: string;
  title: string;
  alt: string;
}> = ({ width, height, src, title, alt }) => {
  return (
    <div className="dmv-image">
      <ImageComp src={src} title={title} alt={alt} width={width} height={height} />
    </div>
  );
};
