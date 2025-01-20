import { useEditor } from '@/contexts';
import {
  flip,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react';
import clsx from 'clsx';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { IconChevronDown } from '../icons';

import './select.scss';
import { Option } from './option';

interface IOptionItem {
  label: string;
  value: string;
}

interface ISelectProps {
  options: IOptionItem[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const Select: FC<ISelectProps> = ({ options, value, onChange, placeholder }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [keyword, setKeyword] = useState('');

  const { dark } = useEditor();

  const displayOptions = useMemo(() => {
    if (!keyword) return options;

    return options.filter((item) => item.label.toLowerCase().includes(keyword.toLowerCase()));
  }, [keyword, options]);

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-start',
    open: isOpen,
    onOpenChange: (open) => {
      if (open) {
        setShowInput(true);
        setIsOpen(true);
      } else {
        setShowInput(false);
        setIsOpen(false);
      }
    },
    middleware: [offset(6), flip(), shift({ padding: 12 })],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  const displayLabel = useMemo(() => {
    const selectOption = options.find((item) => item.value === value);
    if (!selectOption) return '';
    return selectOption.label;
  }, [value]);

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={clsx('dme-select', { 'dme-select-focus': isFocused, 'dme-select-open': isOpen })}
      >
        <div className="dme-select-selection">
          {showInput ? (
            <div className="dme-select-input-wrapper">
              <input
                className="dme-select-input"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoFocus
                placeholder={displayLabel ?? placeholder}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value ?? '')}
              />
            </div>
          ) : (
            <div className="dme-select-content">{displayLabel}</div>
          )}
        </div>
        <div className="dme-select-arrow">
          <IconChevronDown />
        </div>
      </div>
      {isOpen && (
        <FloatingPortal root={document.body}>
          <div
            className={clsx({ 'dme-dark': dark })}
            ref={refs.setFloating}
            style={{ ...floatingStyles, zIndex: 1050 }}
            {...getFloatingProps()}
          >
            <Option
              options={displayOptions}
              value={value}
              keyword={keyword}
              onChange={(value) => {
                onChange(value);
                setIsFocused(false);
                setIsOpen(false);
                setShowInput(false);
              }}
            />
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
