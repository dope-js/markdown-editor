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
        <clipPath id="master_svg0_3_056">
          <rect x="0" y="0" width="24" height="24" rx="0" />
        </clipPath>
      </defs>
      <g transform="matrix(0,1,1,0,0,0)" clipPath="url(#master_svg0_3_056)">
        <g>
          <path
            d="M1,9L1,3C1,1.9,1.9,1,3,1L21,1C22.1046,1,23,1.89543,23,3L23,9C23,10.10457,22.1046,11,21,11L3,11C1.89543,11,1,10.10457,1,9ZM8,15L8,21C8,22.1046,8.895430000000001,23,10,23L21,23C22.1046,23,23,22.1046,23,21L23,15C23,13.8954,22.1046,13,21,13L10,13C8.9,13,8,13.9,8,15ZM1.24469,19.7527C0.9414959,20.0377,0.9414815,21.5021,1.2446760000000001,21.787C1.544813,22.071,2.03104,22.071,2.33118,21.787L5.77518,18.5241C6.07494,18.2397,6.07494,17.7791,5.77518,17.4947L2.33118,14.2318C2.03449,13.9302,1.532895,13.9218,1.225163,14.2133C0.9174294000000001,14.5049,0.9262931,15.9801,1.24469,16.261200000000002L3.14542,18.0094L1.24469,19.7527ZM11,16L11,20L20,20L20,16L11,16Z"
            fillRule="evenodd"
            fill="currentcolor"
            fillOpacity="1"
          />
        </g>
      </g>
    </svg>
  );
}

export const IconInsertColAfter = convertIcon(SvgComponent, 'insert_col_after');
