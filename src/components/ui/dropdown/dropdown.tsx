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
import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { DropdownMenu, type IDropdownMenuItem } from './menu';

import './dropdown.scss';

interface IDropdownProps {
  children?: ReactNode;
  menu: IDropdownMenuItem[];
  clickToHide?: boolean;
}

export const Dropdown: FC<IDropdownProps> = ({ children, menu, clickToHide = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-start',
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(6), flip(), shift({ padding: 12 })],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      {isOpen && (
        <FloatingPortal root={document.body}>
          <div className="dme-body" ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
            <DropdownMenu clickToHide={clickToHide} menu={menu} closeMenu={() => setIsOpen(false)} />
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
