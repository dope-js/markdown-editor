import { isFunction, isNumber, isObject, isString } from '@/utils';
import clsx from 'clsx';
import type { ChangeEvent, FC, FocusEvent } from 'react';
import { useRef, useState } from 'react';
import { Clear } from './clear';
import { Counter } from './counter';
import type { ITextAreaProps } from './types';
import { useAutoSize } from './use-autosize';
import { handleVisibleMaxLength } from './utils';

export const Textarea: FC<ITextAreaProps> = (props) => {
  const {
    value: propsValue,
    minLength: propsMinLength,
    autosize = false,
    showClear = false,
    showCounter,
    maxCount,
    getValueLength,
    disabled = false,
    readonly = false,
    borderless,
    style,
    rows = 4,
    autoFocus,
    placeholder,
    maxLength,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    onEnterPress,
    onClear,
  } = props;

  const [value, setValue] = useState(propsValue);
  const [isFocused, setIsFocused] = useState(false);
  const [isHover, setIsHover] = useState(false);
  // const [height, setHeight] = useState(0);
  const [minLength, setMinLength] = useState(propsMinLength);
  const ref = useRef<HTMLTextAreaElement>(null);

  useAutoSize(value ?? '', placeholder, rows, ref, autosize);

  return (
    <div
      className={clsx('dme-textarea-wrapper', {
        ['dme-textarea-borderless']: borderless,
        ['dme-textarea-wrapper-disabled']: disabled,
        ['dme-textarea-wrapper-readonly']: readonly,
        ['dme-textarea-wrapper-focus']: isFocused,
      })}
      style={style}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <textarea
        className={clsx('dme-textarea', {
          ['dme-textarea-disable']: disabled,
          ['dme-textarea-readonly']: readonly,
          ['dme-textarea-autosize']: isObject(autosize) ? autosize.maxRows === undefined : autosize,
          ['dme-textarea-showClear']: showClear,
        })}
        ref={ref}
        autoFocus={autoFocus}
        disabled={disabled}
        readOnly={readonly}
        placeholder={!placeholder ? undefined : placeholder}
        maxLength={!isFunction(getValueLength) ? maxLength : undefined}
        minLength={minLength}
        onChange={(e) => {
          let nextValue: string = e.target.value;
          if (maxLength && isFunction(getValueLength))
            nextValue = handleVisibleMaxLength(nextValue, maxLength, getValueLength);

          if (propsMinLength && isFunction(getValueLength)) {
            if (isNumber(propsMinLength) && propsMinLength >= 0 && isFunction(getValueLength) && isString(value)) {
              const valueLength = getValueLength(nextValue);
              if (valueLength < propsMinLength) {
                const newMinLength = value.length + (propsMinLength - valueLength);
                if (newMinLength !== minLength) setMinLength(newMinLength);
              } else {
                if (minLength !== propsMinLength) setMinLength(minLength);
              }
            }
          }

          if ('value' in props) {
            onChange?.(nextValue, e);
          } else {
            setValue(nextValue);
            if (autosize) {
              // resize
            }
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
      <Clear
        value={value}
        showClear={showClear}
        disabled={disabled}
        readonly={readonly}
        isFocused={isFocused}
        isHover={isHover}
        handleClear={(e) => {
          if ('value' in props) {
            setIsFocused(false);
          } else {
            setValue('');
            setIsFocused(false);
          }

          if (isFocused) {
            onBlur?.(e as unknown as FocusEvent<HTMLTextAreaElement>);
          }

          onChange?.('', e as unknown as ChangeEvent<HTMLTextAreaElement>);
          onClear?.(e);
          e.stopPropagation();
        }}
      />
      <Counter showCounter={showCounter} maxCount={maxCount} getValueLength={getValueLength} value={value} />
    </div>
  );
};

Textarea.displayName = 'Textarea';
