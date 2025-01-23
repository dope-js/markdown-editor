import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import { useMemo } from 'react';
import styles from './switch.module.scss';

interface ISwitchOption {
  icon: ReactNode;
  value: string | number | boolean;
}

interface ISwitchButtonsProps {
  options: ISwitchOption[];
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
}

export const SwitchButtons: FC<ISwitchButtonsProps> = ({ options, value, onChange }) => {
  const selectedIdx = useMemo(() => options.findIndex((item) => item.value === value), [value, options]);

  const trackLeft = useMemo(() => selectedIdx * 32 + 6, [selectedIdx]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.track} style={{ left: trackLeft }} />
      {options.map((item, idx) => (
        <span
          className={clsx(styles.item, { [styles.selected]: idx === selectedIdx })}
          key={`option-${idx}`}
          onClick={() => {
            onChange(item.value);
          }}
        >
          {item.icon}
        </span>
      ))}
    </div>
  );
};
