import { isFunction } from '@/utils';
import clsx from 'clsx';
import type { FC } from 'react';
import { useMemo } from 'react';
import type { ITextAreaProps } from './types';

type ICounterProps = Pick<ITextAreaProps, 'showCounter' | 'maxCount' | 'getValueLength' | 'value'>;

export const Counter: FC<ICounterProps> = ({ showCounter, maxCount, getValueLength, value }) => {
  const current = useMemo(() => {
    if (!value) return 0;
    if (isFunction(getValueLength)) return getValueLength(value);
    return value.length;
  }, [value, getValueLength]);

  if (!showCounter && !maxCount) return null;

  return (
    <div className={clsx('dme-textarea-counter', { ['dme-textarea-counter-exceed']: maxCount && current > maxCount })}>
      {current}
      {maxCount ? '/' : null}
      {maxCount}
    </div>
  );
};
