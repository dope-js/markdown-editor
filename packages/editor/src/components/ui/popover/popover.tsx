import { useEditor } from '@/contexts';
import {
  arrow,
  flip,
  FloatingArrow,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useMergeRefs,
} from '@floating-ui/react';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import { cloneElement, isValidElement, useEffect, useMemo, useRef, useState } from 'react';

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
    middleware: [offset(6), flip(), shift({ padding: 12 }), arrow({ element: arrowRef })],
  });

  const click = useClick(context, { enabled: trigger === 'click' });
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, click]);

  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([context.refs.setReference, childrenRef]);

  const displayChildren = useMemo(() => {
    if (typeof children === 'string') {
      return (
        <span ref={refs.setReference} {...getReferenceProps()}>
          {children}
        </span>
      );
    }

    if (isValidElement(children)) {
      return cloneElement(
        children,
        getReferenceProps({
          ref,
          ...children.props,
          'data-state': context.open ? 'open' : 'closed',
        })
      );
    }

    return children;
  }, [children, refs.setReference, getReferenceProps]);

  return (
    <>
      {displayChildren}
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
            <FloatingArrow
              ref={arrowRef}
              context={context}
              fill="var(--dme-color-bg-3)"
              width={24}
              d="M0,25L0,24C4,24,5.5,22.99999,7.5,20.99999C9.5,19,10,18,12,18C14,18,14.5,19,16.5,21C18.5,23,20,24,24,24L24,25L0,25Z"
            />
            <div className={contentClassName}>
              <div className="dme-popover-content">{content}</div>
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
