import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type HtmlType = 'button' | 'reset' | 'submit';
export type Size = 'default' | 'small' | 'large';
export type Theme = 'solid' | 'borderless' | 'light';
export type Type = 'primary' | 'secondary' | 'tertiary' | 'warning' | 'danger';
export type HorizontalPaddingType = 'left' | 'right';

export interface IButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  id?: string;
  block?: boolean;
  circle?: boolean;
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  htmlType?: HtmlType;
  size?: Size;
  style?: React.CSSProperties;
  theme?: Theme;
  type?: Type;
  noHorizontalPadding?: boolean | HorizontalPaddingType | HorizontalPaddingType[];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  'aria-label'?: React.AriaAttributes['aria-label'];
}
