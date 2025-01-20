import { Textarea } from '@/components';
import type { FC } from 'react';
import { useRef, useState } from 'react';
import { InlineMath } from 'react-katex';
import styles from './formular.module.scss';

interface IFormularEditorProps {
  math: string;
  autoFocus?: boolean;
  onChange: (math: string) => void;
}

export const FormularEditor: FC<IFormularEditorProps> = ({ math, onChange, autoFocus = false }) => {
  const [value, setValue] = useState(math);
  const first = useRef(false);
  // const ref = useRef<HTMLTextAreaElement | null>(null);

  // useEffect(() => {
  //   if (autoFocus && ref.current) {
  //     ref.current.focus();
  //   }
  // }, [autoFocus, ref.current]);

  return (
    <div className={styles.editor}>
      {!!value && (
        <div className={styles.preview}>
          <InlineMath
            math={value}
            renderError={(err) => (
              <div className={styles.error}>
                <div className={styles.errorFormular}>{value}</div>
                <div className={styles.message}>{err.message}</div>
              </div>
            )}
          />
        </div>
      )}
      <Textarea
        autosize={{ minRows: 1, maxRows: 5 }}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        data-1p-ignore
        className={styles.input}
        // ref={ref}
        value={value}
        defaultValue={math}
        onChange={setValue}
        onEnterPress={() => onChange(value)}
        onBlur={() => onChange(value)}
        onKeyUp={(e) => {
          if (e.key === 'Escape') {
            onChange(value);
          }
        }}
        onFocus={(e) => {
          if (!first.current) {
            e.currentTarget.select();
            first.current = true;
          }
        }}
      />
    </div>
  );
};
