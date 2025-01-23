import { clsx } from 'clsx';
import type { CSSProperties, FC, ReactNode } from 'react';

import './divider.scss';

interface IDividerProps {
  align?: 'left' | 'right' | 'center';
  margin?: number | string;
  children?: ReactNode;
  className?: string;
  dashed?: boolean;
  layout?: 'horizontal' | 'vertical';
  style?: CSSProperties;
}

export const Divider: FC<IDividerProps> = (props) => {
  const { layout = 'horizontal', dashed, align = 'center', className, margin, style, children, ...rest } = props;

  const dividerClassNames = clsx(`dme-divider`, className, {
    [`dme-divider-horizontal`]: layout === 'horizontal',
    [`dme-divider-vertical`]: layout === 'vertical',
    [`dme-divider-dashed`]: !!dashed,
    [`dme-divider-with-text`]: children && layout === 'horizontal',
    [`dme-divider-with-text-${align}`]: children && layout === 'horizontal',
  });

  let overrideDefaultStyle: CSSProperties = {};

  if (margin !== undefined) {
    if (layout === 'vertical') {
      overrideDefaultStyle = {
        marginLeft: margin,
        marginRight: margin,
      };
    } else if (layout === 'horizontal') {
      overrideDefaultStyle = {
        marginTop: margin,
        marginBottom: margin,
      };
    }
  }

  return (
    <div {...rest} className={dividerClassNames} style={{ ...overrideDefaultStyle, ...style }}>
      {children && layout === 'horizontal' ? (
        typeof children === 'string' ? (
          <span className={`dme-divider_inner-text`}>{children}</span>
        ) : (
          children
        )
      ) : null}
    </div>
  );
};
