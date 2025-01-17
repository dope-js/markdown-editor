import { noop } from '@/utils';
import { useMemo, type FC } from 'react';
import { BaseButton } from './base';
import { IconButton } from './icon';
import type { IButtonProps } from './types';

import './button.scss';

export const Button: FC<IButtonProps> = (props) => {
  const hasIcon = useMemo(() => !!props.icon, [props.icon]);
  const isLoading = useMemo(() => !!props.loading, [props.loading]);
  const isDisabled = useMemo(() => !!props.disabled, [props.disabled]);

  if (hasIcon || (isLoading && !isDisabled)) {
    return <IconButton {...props} />;
  } else {
    return <BaseButton {...props} />;
  }
};

Button.defaultProps = {
  disabled: false,
  size: 'default',
  type: 'primary',
  theme: 'light',
  block: false,
  htmlType: 'button',
  onMouseDown: noop,
  onClick: noop,
  onMouseEnter: noop,
  onMouseLeave: noop,
};
