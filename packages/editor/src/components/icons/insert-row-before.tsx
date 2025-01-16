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
      <defs>
        <clipPath id="master_svg0_3_049">
          <rect x="0" y="24" width="24" height="24" rx="0" />
        </clipPath>
      </defs>
      <g transform="matrix(1,0,0,-1,0,48)" clipPath="url(#master_svg0_3_049)">
        <g>
          <path
            d="M1,33L1,27C1,25.9,1.9,25,3,25L21,25C22.1046,25,23,25.89543,23,27L23,33C23,34.10457,22.1046,35,21,35L3,35C1.89543,35,1,34.10457,1,33ZM8,39L8,45C8,46.104600000000005,8.895430000000001,47,10,47L21,47C22.1046,47,23,46.104600000000005,23,45L23,39C23,37.8954,22.1046,37,21,37L10,37C8.9,37,8,37.9,8,39ZM1.24469,43.752700000000004C0.9414959,44.0377,0.9414815,45.5021,1.2446760000000001,45.787C1.544813,46.071,2.03104,46.071,2.33118,45.787L5.77518,42.524100000000004C6.07494,42.2397,6.07494,41.7791,5.77518,41.4947L2.33118,38.2318C2.03449,37.9302,1.532895,37.9218,1.225163,38.213300000000004C0.9174294000000001,38.5049,0.9262931,39.9801,1.24469,40.2612L3.14542,42.0094L1.24469,43.752700000000004ZM11,40L11,44L20,44L20,40L11,40Z"
            fillRule="evenodd"
            fill="currentcolor"
            fillOpacity="1"
          />
        </g>
      </g>
    </svg>
  );
}

export const IconInsertRowBefore = convertIcon(SvgComponent, 'insert_row_before');
