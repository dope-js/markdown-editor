import { clsx } from 'clsx';
import type { CSSProperties, FC, MouseEvent, ReactNode } from 'react';
import { useMemo } from 'react';
import type { Size } from '../ui';
import { Button, Tooltip } from '../ui';

import './button.scss';

interface IToolbarButtonProps {
  icon: ReactNode;
  active?: boolean;
  disabled?: boolean;
  size?: Size;
  title?: string;
  block?: boolean;
  minor?: boolean;
  style?: CSSProperties;
  activeTitle?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
}

type IInnerButtonProps = Omit<IToolbarButtonProps, 'title' | 'activeTitle'>;

const InnerButton: FC<IInnerButtonProps> = ({ active = false, minor = false, ...rest }) => {
  return (
    <Button
      className={clsx({ 'dme-button-minor': minor })}
      theme={active ? 'light' : 'borderless'}
      type={active ? 'primary' : 'tertiary'}
      {...rest}
    />
  );
};

export const EditorButton: FC<IToolbarButtonProps> = ({ active = false, title = '', activeTitle, ...rest }) => {
  const displayTitle = useMemo(() => {
    if (active && activeTitle) return activeTitle;
    return title;
  }, [active, title, activeTitle]);

  if (!displayTitle) return <InnerButton active={active} {...rest} />;

  return (
    <Tooltip content={displayTitle}>
      <div>
        <InnerButton active={active} {...rest} />
      </div>
    </Tooltip>
  );
};
