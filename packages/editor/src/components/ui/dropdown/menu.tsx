import type { FC } from 'react';

export interface IDropdownMenuItem {
  name: string;
  onClick: () => void;
}

interface IDropdownMenuProps {
  menu: IDropdownMenuItem[];
  clickToHide: boolean;
  closeMenu: () => void;
}

export const DropdownMenu: FC<IDropdownMenuProps> = ({ menu, clickToHide, closeMenu }) => {
  return (
    <div className="dme-dropdown-menu">
      {menu.map((item, idx) => (
        <div
          key={`item-${idx}`}
          className="dme-dropdown-item"
          onClick={() => {
            item.onClick();
            if (clickToHide) closeMenu();
          }}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};
