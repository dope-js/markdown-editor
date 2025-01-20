import { useEditor } from '@/contexts';
import { arrow, flip, FloatingPortal, offset, shift, useFloating, useHover, useInteractions } from '@floating-ui/react';
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
            <svg
              ref={arrowRef}
              aria-hidden="true"
              className="demi-tooltip-arrow"
              width="24"
              height="7"
              viewBox="0 0 24 7"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M24 0V1C20 1 18.5 2 16.5 4C14.5 6 14 7 12 7C10 7 9.5 6 7.5 4C5.5 2 4 1 0 1V0H24Z"></path>
            </svg>
            {typeof content === 'string' ? <span className="dme-tooltip-content">{content}</span> : content}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
