import clsx from 'clsx';
import type { FC } from 'react';
import type { IButtonProps } from './types';

export const BaseButton: FC<IButtonProps> = (props) => {
  const { children, block, htmlType, circle, className, style, disabled, size, theme, type } = props;

  const baseProps = {
    disabled,
    className: clsx(
      'dme-button',
      {
        [`dme-button-${type}`]: !disabled && type,
        [`dme-button-disabled`]: disabled,
        [`dme-button-size-large`]: size === 'large',
        [`$dme-button-size-small`]: size === 'small',
        // [`${prefixCls}-loading`]: loading,
        [`dme-button-light`]: theme === 'light',
        [`dme-button-block`]: block,
        [`dme-button-circle`]: circle,
        [`dme-button-borderless`]: theme === 'borderless',
        [`dme-button-${type}-disabled`]: disabled && type,
      },
      className
    ),
    type: htmlType,
    'aria-disabled': disabled,
  };

  return (
    <button {...baseProps} onClick={props.onClick} onMouseDown={props.onMouseDown} style={style}>
      <span className={`dme-button-content`} onClick={(e) => disabled && e.stopPropagation()}>
        {children}
      </span>
    </button>
  );
};
