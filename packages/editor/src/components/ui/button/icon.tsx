import { clsx } from 'clsx';
import type { CSSProperties, FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from './button';
import { SpinIcon } from './spin';
import type { IButtonProps } from './types';

export const IconButton: FC<IButtonProps> = (props) => {
  const {
    children: originChildren,
    iconPosition,
    style: originStyle,
    icon,
    noHorizontalPadding,
    theme,
    className,
    loading,
    disabled,
    ...otherProps
  } = props;

  const [style, setStyle] = useState<CSSProperties>(originStyle ?? {});

  useEffect(() => {
    if (Array.isArray(noHorizontalPadding)) {
      if (noHorizontalPadding.includes('left')) setStyle((style) => ({ ...style, paddingLeft: 0 }));
      if (noHorizontalPadding.includes('right')) setStyle((style) => ({ ...style, paddingRight: 0 }));
    } else if (noHorizontalPadding === true) {
      setStyle((style) => ({ ...style, paddingLeft: 0, paddingRight: 0 }));
    } else if (typeof noHorizontalPadding === 'string') {
      if (noHorizontalPadding === 'left') setStyle((style) => ({ ...style, paddingLeft: 0 }));
      else if (noHorizontalPadding === 'right') setStyle((style) => ({ ...style, paddingRight: 0 }));
    }
  }, [noHorizontalPadding]);

  const iconEle = useMemo(() => {
    if (loading && !disabled) {
      return <SpinIcon />;
    }

    return icon;
  }, [loading, disabled, icon]);

  const btnTextCls = useMemo(
    () =>
      clsx({
        ['dme-button-content-left']: iconPosition === 'right',
        ['dme-button-content-right']: iconPosition === 'right',
      }),
    [iconPosition]
  );

  const children = useMemo(
    () => (originChildren != null ? <span className={btnTextCls}>{originChildren}</span> : null),
    [originChildren, btnTextCls]
  );

  const finalChildren = useMemo(() => {
    if (iconPosition === 'left') {
      return (
        <>
          {iconEle}
          {children}
        </>
      );
    }

    return (
      <>
        {children}
        {iconEle}
      </>
    );
  }, [children, iconPosition]);

  const iconBtnCls = useMemo(() => {
    return clsx(className, 'dme-button-with-icon', {
      ['dme-button-with-icon-only']: children == null || (children as any) === '',
      ['dme-button-loading']: loading,
    });
  }, [loading, children]);

  return (
    <Button {...otherProps} className={iconBtnCls} theme={theme} style={style}>
      {finalChildren}
    </Button>
  );
};
