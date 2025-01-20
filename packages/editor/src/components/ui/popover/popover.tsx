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
import type { FC, ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import './popover.scss';

interface IPopoverProps {
  children: ReactNode;
  content?: ReactNode;
  position: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'click' | 'custom';
  visible?: boolean;
  className?: string;
  contentClassName?: string;
}

export const Popover: FC<IPopoverProps> = ({
  visible,
  position,
  trigger,
  children,
  content,
  className,
  contentClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { dark } = useEditor();
  const arrowRef = useRef(null);

  useEffect(() => {
    if (visible !== undefined) {
      setIsOpen(visible);
    }
  }, [visible]);

  const { refs, floatingStyles, context, placement } = useFloating({
    placement: position,
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(6), flip(), shift({ padding: 12 })],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const plugins = useMemo(() => {
    const ret = [dismiss];
    if (trigger === 'click') {
      ret.push(click);
    }

    return ret;
  }, [trigger]);

  const { getReferenceProps, getFloatingProps } = useInteractions(plugins);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      {isOpen && (
        <FloatingPortal root={document.body}>
          <div
            className={clsx('dme-popover', { 'dme-dark': dark }, className)}
            ref={refs.setFloating}
            style={{ ...floatingStyles, zIndex: 1050 }}
            // eslint-disable-next-line react/no-unknown-property
            x-placement={placement}
            {...getFloatingProps()}
          >
            <svg ref={arrowRef} width="24" height="8" xmlns="http://www.w3.org/2000/svg" className="demi-popover-arrow">
              <path
                d="M0 0L0 1C4 1, 5.5 2, 7.5 4S10,7 12,7S14.5  6, 16.5 4S20,1 24,1L24 0L0 0z"
                fill="var(--dme-color-bg-3)"
              ></path>
            </svg>
            <div className={contentClassName}>
              <div className="dme-popover-content">{content}</div>
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
