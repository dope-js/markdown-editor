import clsx from 'clsx';
import { useEffect, useRef, type FC } from 'react';
import { Highlight } from '../highlight';
import { IconTick } from '../icons';

export interface IOptionItem {
  label: string;
  value: string;
}

interface IOptionProps {
  options: IOptionItem[];
  keyword: string;
  value: string;
  onChange: (value: string) => void;
}

export const Option: FC<IOptionProps> = ({ options, keyword, value, onChange }) => {
  const ref = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const el = ref.current.get(value);
    if (!el) return;

    el.scrollIntoView({
      block: 'center',
    });
  }, [value, ref.current]);

  return (
    <div className="dme-select-option">
      {options.map((item, idx) => (
        <div
          key={idx}
          className={clsx('dme-select-option-item', { 'dme-select-option-selected': value === item.value })}
          ref={(el) => {
            if (el) {
              ref.current.set(item.value, el);
            }
          }}
          onClick={() => {
            if (value === item.value) return;
            onChange(item.value);
          }}
        >
          <span className="dme-select-option-icon">
            <IconTick />
          </span>
          <span className="dme-select-option-text">
            <Highlight value={item.label} keyword={keyword} />
          </span>
        </div>
      ))}
    </div>
  );
};
