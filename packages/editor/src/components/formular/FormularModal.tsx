import { useEditor } from '@/contexts';
import { Modal } from '@douyinfe/semi-ui';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { BlockMath } from 'react-katex';
import styles from './modal.module.scss';
import { Textarea } from '../ui';

interface IFormularModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  math: string;
  setMath: (math: string) => void;
  title: string;
  clearOnSubmit?: boolean;
}

export const FormularModal: FC<IFormularModalProps> = ({ title, visible, setVisible, math, setMath }) => {
  const [value, setValue] = useState(math);
  const first = useRef(false);

  useEffect(() => {
    setValue(math);
  }, [math]);

  const { t } = useEditor();

  return (
    <Modal
      visible={visible}
      title={title}
      onCancel={() => {
        setVisible(false);
      }}
      cancelText={t('cancel')}
      onOk={() => {
        const newValue = value.trim();
        setMath(newValue);
      }}
      okButtonProps={{ disabled: !value }}
      okText={t('submit')}
    >
      <div className={styles.editor}>
        {!!value && (
          <div className={styles.preview}>
            <BlockMath
              math={value}
              renderError={(err) => (
                <div className={styles.error}>
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
          autoFocus
          value={value}
          defaultValue={math}
          onChange={setValue}
          onFocus={(e) => {
            if (!first.current) {
              e.currentTarget.select();
              first.current = true;
            }
          }}
        />
      </div>
    </Modal>
  );
};
