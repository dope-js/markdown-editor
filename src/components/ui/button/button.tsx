import { noop } from 'lodash-es';
import { useMemo, type FC } from 'react';
import { BaseButton } from './base';
import { IconButton } from './icon';
import type { IButtonProps } from './types';

import './button.scss';

export const Button: FC<IButtonProps> = ({
  disabled = false,
  size = 'default',
  type = 'primary',
  theme = 'light',
  block = false,
  loading = false,
  htmlType = 'button',
  onMouseDown = noop,
  onClick = noop,
  onMouseEnter = noop,
  onMouseLeave = noop,
  ...props
}) => {
  const hasIcon = useMemo(() => !!props.icon, [props.icon]);

  if (hasIcon || (loading && !disabled)) {
    return (
      <IconButton
        disabled={disabled}
        size={size}
        type={type}
        theme={theme}
        block={block}
        loading={loading}
        htmlType={htmlType}
        onMouseDown={onMouseDown}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...props}
      />
    );
  } else {
    return (
      <BaseButton
        disabled={disabled}
        size={size}
        type={type}
        theme={theme}
        block={block}
        loading={loading}
        htmlType={htmlType}
        onMouseDown={onMouseDown}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...props}
      />
    );
  }
};
