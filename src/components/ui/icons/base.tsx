import { clsx } from 'clsx';
import type { CSSProperties, ComponentType, DetailedHTMLProps, ReactNode } from 'react';
import { createElement, forwardRef } from 'react';

import './icon.scss';

export type IconSize = 'small' | 'default';

export interface IconProps extends DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  svg: ReactNode;
  size?: IconSize;
  spin?: boolean;
  rotate?: number;
  type?: string;
}

const Icon = forwardRef<HTMLSpanElement, IconProps>((props, ref) => {
  const { svg, spin = false, rotate, style, className, type, size = 'default', ...restProps } = props;
  const classes = clsx(
    `dme-icon`,
    {
      [`dme-icon-small`]: size === 'small', // 12x12
      [`dme-icon-default`]: size === 'default', // 16x16
      [`dme-icon-spinning`]: spin === true,
      [`dme-icon-${type}`]: Boolean(type),
    },
    className
  );
  const outerStyle: CSSProperties = {};
  if (Number.isSafeInteger(rotate)) {
    outerStyle.transform = `rotate(${rotate}deg)`;
  }
  Object.assign(outerStyle, style);
  return (
    <span role="img" ref={ref} aria-label={type} className={classes} style={outerStyle} {...restProps}>
      {svg}
    </span>
  );
});

Icon.displayName = 'Icon';

export const convertIcon = (Svg: ComponentType, iconType: string) => {
  const InnerIcon = forwardRef<HTMLSpanElement, Omit<IconProps, 'svg' | 'type'>>((props, ref) => (
    <Icon svg={createElement(Svg)} type={iconType} ref={ref as any} {...props} />
  ));

  InnerIcon.displayName = 'Icon';

  return InnerIcon;
};
