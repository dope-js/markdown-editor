import { useEditor } from '@/contexts';
import { Modal } from '@douyinfe/semi-ui';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { BlockMath } from 'react-katex';
import { Textarea } from '../ui';

import './modal.scss';

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
      <div className={'dme-formular-editor'}>
        {!!value && (
          <div className={'dme-formular-preview'}>
            <BlockMath
              math={value}
              renderError={(err) => (
                <div className={'dme-formular-error'}>
                  <div className={'dme-formular-message'}>{err.message}</div>
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
          className={'dme-formular-input'}
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
