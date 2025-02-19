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
        d="M3.5 3C2.67157 3 2 3.67157 2 4.5C2 5.32843 2.67157 6 3.5 6H20.5C21.3284 6 22 5.32843 22 4.5C22 3.67157 21.3284 3 20.5 3H3.5ZM10.5 8C9.67157 8 9 8.67157 9 9.5C9 10.3284 9.67157 11 10.5 11H20.5C21.3284 11 22 10.3284 22 9.5C22 8.67157 21.3284 8 20.5 8H10.5ZM2 14.5C2 13.6716 2.67157 13 3.5 13H20.5C21.3284 13 22 13.6716 22 14.5C22 15.3284 21.3284 16 20.5 16H3.5C2.67157 16 2 15.3284 2 14.5ZM10.5 18C9.67157 18 9 18.6716 9 19.5C9 20.3284 9.67157 21 10.5 21H20.5C21.3284 21 22 20.3284 22 19.5C22 18.6716 21.3284 18 20.5 18H10.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const IconAlignRight = convertIcon(SvgComponent, 'align_right');
