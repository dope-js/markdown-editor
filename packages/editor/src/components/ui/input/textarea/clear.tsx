import { clsx } from 'clsx';
import type { FC, MouseEvent } from 'react';
import { useMemo } from 'react';
import type { ITextAreaProps } from './types';
import { IconClear } from '../../icons';

type IClearProps = Pick<ITextAreaProps, 'showClear' | 'value' | 'disabled' | 'readonly'> & {
  isFocused: boolean;
  isHover: boolean;
  handleClear: (e: MouseEvent<HTMLTextAreaElement>) => void;
};

export const Clear: FC<IClearProps> = ({ showClear, value, disabled, readonly, isFocused, isHover, handleClear }) => {
  const allowClear = useMemo(() => {
    return value && showClear && !disabled && (isFocused || isHover) && !readonly;
  }, [showClear, value, disabled, readonly, isFocused, isHover]);

  if (!showClear) return null;

  return (
    <div
      onClick={(e) => handleClear(e as unknown as MouseEvent<HTMLTextAreaElement>)}
      className={clsx('dme-clearbtn', { ['dme-clearbtn-hidden']: !allowClear })}
    >
      <IconClear />
    </div>
  );
};
