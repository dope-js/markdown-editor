import { useEditor } from '@/contexts';
import {
  arrow,
  flip,
  FloatingArrow,
  FloatingPortal,
  offset,
  shift,
  useFloating,
  useHover,
  useInteractions,
} from '@floating-ui/react';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import { useRef, useState } from 'react';

import './tooltip.scss';

interface ITooltipProps {
  children: ReactNode;
  content: ReactNode;
}

export const Tooltip: FC<ITooltipProps> = ({ children, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);
  const { dark } = useEditor();

  const { refs, floatingStyles, context } = useFloating({
    placement: 'top',
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      arrow({
        element: arrowRef,
      }),
      offset(8),
      flip(),
      shift({ padding: 12 }),
    ],
  });

  const hover = useHover(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      {isOpen && (
        <FloatingPortal>
          <div
            className={clsx('dme-tooltip', { 'dme-dark': dark })}
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <FloatingArrow
              ref={arrowRef}
              context={context}
              fill="rgba(var(--dme-grey-7), 1)"
              width={24}
              d="M0,25L0,24C4,24,5.5,22.99999,7.5,20.99999C9.5,19,10,18,12,18C14,18,14.5,19,16.5,21C18.5,23,20,24,24,24L24,25L0,25Z"
            />
            {typeof content === 'string' ? <span className="dme-tooltip-content">{content}</span> : content}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
