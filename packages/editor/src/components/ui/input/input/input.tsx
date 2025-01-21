import clsx from 'clsx';
import type { FC } from 'react';
import { useState } from 'react';

import './input.scss';

interface InputProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
}

export const Input: FC<InputProps> = ({ value, onChange, error = false }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className={clsx('dme-input-wrapper', { 'dme-input-focus': focused, 'dme-input-error': error })}>
      <input
        className="dme-input"
        value={value}
        onChange={(e) => onChange?.(e.currentTarget.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
};
