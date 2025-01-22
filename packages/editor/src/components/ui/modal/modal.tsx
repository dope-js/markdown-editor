import { useEditor } from '@/contexts';
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import { Button, type IButtonProps } from '../button';
import { IconClose } from '../icons';

import './modal.scss';

interface IModalProps {
  visible: boolean;
  cancelText?: string;
  onVisibleChange: (visible: boolean) => void;
  title?: string;
  children?: ReactNode;
  okText?: string;
  onOk: () => void;
  okButtonProps?: Partial<IButtonProps>;
}

export const Modal: FC<IModalProps> = ({
  visible,
  onVisibleChange,
  children,
  title,
  cancelText,
  okText,
  onOk,
  okButtonProps,
}) => {
  const { dark, t } = useEditor();

  const { context, refs } = useFloating({
    open: visible,
    onOpenChange: onVisibleChange,
  });

  const dismiss = useDismiss(context, { outsidePressEvent: 'mousedown' });

  const { getFloatingProps } = useInteractions([dismiss]);

  return (
    <FloatingPortal root={document.body}>
      <FloatingOverlay className={clsx('dme-modal-overlay', { 'dme-dark': dark })} lockScroll>
        <FloatingFocusManager context={context}>
          <div className="dme-modal" ref={refs.setFloating} {...getFloatingProps()}>
            <div className="dme-modal-header">
              <span className="dme-modal-title">{title}</span>
              <Button
                size="small"
                icon={<IconClose />}
                type="tertiary"
                theme="borderless"
                onClick={() => onVisibleChange(false)}
              />
            </div>
            {children}
            <div className="dme-modal-footer">
              <Button
                type="tertiary"
                onClick={() => {
                  onVisibleChange(false);
                }}
              >
                {cancelText ?? t('cancel')}
              </Button>
              <Button
                theme="solid"
                {...okButtonProps}
                onClick={() => {
                  onOk();
                }}
              >
                {okText ?? t('submit')}
              </Button>
            </div>
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
};
