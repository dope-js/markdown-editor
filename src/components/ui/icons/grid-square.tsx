import type { SVGProps } from 'react';
import { convertIcon } from './base';

function SvgComponent(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      focusable={false}
      aria-hidden={true}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 1C2.34315 1 1 2.34315 1 4V20C1 21.6569 2.34315 23 4 23H20C21.6569 23 23 21.6569 23 20V4C23 2.34315 21.6569 1 20 1H4ZM19 4C19.5523 4 20 4.44772 20 5V10.5H13.5V4H19ZM10.5 4H5C4.44772 4 4 4.44772 4 5V10.5H10.5V4ZM4 13.5V19C4 19.5523 4.44772 20 5 20H10.5V13.5H4ZM13.5 20H19C19.5523 20 20 19.5523 20 19V13.5H13.5V20Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const IconGridSquare = convertIcon(SvgComponent, 'grid-square');
