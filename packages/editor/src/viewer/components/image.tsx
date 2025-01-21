import { Image as SemiImage } from '@douyinfe/semi-ui';
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
      <SemiImage src={src} title={title} alt={alt} width={width} height={height} />
    </div>
  );
};
