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
        d="M6 3C6 2.44772 6.44772 2 7 2H12.5C15.7318 2 18.5 4.49474 18.5 7.75C18.5 9.23767 17.9219 10.5665 16.9855 11.571C18.4934 12.6006 19.5 14.287 19.5 16.25C19.5 19.5053 16.7318 22 13.5 22H7C6.44772 22 6 21.5523 6 21V3ZM13 19C14.7388 19 16 17.6892 16 16.25C16 14.8108 14.7388 13.5 13 13.5H9.00003V19H13ZM12 10.5C13.7388 10.5 15 9.18916 15 7.75C15 6.31084 13.7388 5 12 5H9.00003V10.5H12Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const IconBold = convertIcon(SvgComponent, 'bold');
