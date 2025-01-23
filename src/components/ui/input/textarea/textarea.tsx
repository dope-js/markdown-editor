import clsx from 'clsx';
import { isObject } from 'lodash-es';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { ITextAreaProps } from './types';
import { useAutoSize } from './use-autosize';

import './textarea.scss';

export const Textarea: FC<ITextAreaProps> = (props) => {
  const {
    value: propsValue,
    autosize = false,
    style,
    rows = 3,
    autoFocus,
    placeholder,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    onEnterPress,
  } = props;

  const [value, setValue] = useState(propsValue);
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  useAutoSize(value ?? '', placeholder, rows, ref, autosize);

  useEffect(() => {
    if (ref.current && autoFocus) ref.current.focus();
  }, [autoFocus, ref.current]);

  return (
    <div
      className={clsx('dme-textarea-wrapper', {
        ['dme-textarea-wrapper-focused']: isFocused,
      })}
      style={style}
    >
      <textarea
        className={clsx('dme-textarea', {
          ['dme-textarea-autosize']: isObject(autosize) ? autosize.maxRows === undefined : autosize,
        })}
        ref={ref}
        autoFocus={autoFocus}
        disabled={false}
        readOnly={false}
        placeholder={!placeholder ? undefined : placeholder}
        onChange={(e) => {
          const nextValue = e.target.value;

          if ('value' in props) {
            onChange?.(nextValue, e);
          } else {
            setValue(nextValue);
            onChange?.(nextValue, e);
          }
          setValue(e.target.value);
        }}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.keyCode === 13) onEnterPress?.(e);
        }}
        value={value === null || value === undefined ? '' : value}
      />
    </div>
  );
};

Textarea.displayName = 'Textarea';
