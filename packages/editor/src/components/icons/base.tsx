import { clsx } from 'clsx';
import type { CSSProperties, ComponentType, DetailedHTMLProps, ReactNode } from 'react';
import { createElement, forwardRef } from 'react';

export type IconSize = 'inherit' | 'extra-small' | 'small' | 'default' | 'large' | 'extra-large';

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
    `dopejs-icon`,
    {
      [`dopejs-icon-extra-small`]: size === 'extra-small', // 8x8
      [`dopejs-icon-small`]: size === 'small', // 12x12
      [`dopejs-icon-default`]: size === 'default', // 16x16
      [`dopejs-icon-large`]: size === 'large', // 20x20
      [`dopejs-icon-extra-large`]: size === 'extra-large', // 24x24
      [`dopejs-icon-spinning`]: spin === true,
      [`dopejs-icon-${type}`]: Boolean(type),
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore used to judge whether it is a semi-icon in semi-ui
  // builtin icon case
  InnerIcon.elementType = 'Icon';
  return InnerIcon;
};
