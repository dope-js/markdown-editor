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
        <clipPath id="master_svg0_3_063">
          <rect x="24" y="0" width="24" height="24" rx="0" />
        </clipPath>
      </defs>
      <g transform="matrix(0,1,-1,0,24,-24)" clipPath="url(#master_svg0_3_063)">
        <g>
          <path
            d="M25,9L25,3C25,1.9,25.9,1,27,1L45,1C46.104600000000005,1,47,1.89543,47,3L47,9C47,10.10457,46.104600000000005,11,45,11L27,11C25.89543,11,25,10.10457,25,9ZM32,15L32,21C32,22.1046,32.89543,23,34,23L45,23C46.104600000000005,23,47,22.1046,47,21L47,15C47,13.8954,46.104600000000005,13,45,13L34,13C32.9,13,32,13.9,32,15ZM25.24469,19.7527C24.9414959,20.0377,24.9414815,21.5021,25.244676,21.787C25.544813,22.071,26.03104,22.071,26.33118,21.787L29.77518,18.5241C30.074939999999998,18.2397,30.074939999999998,17.7791,29.77518,17.4947L26.33118,14.2318C26.034489999999998,13.9302,25.532895,13.9218,25.225163,14.2133C24.9174294,14.5049,24.9262931,15.9801,25.24469,16.261200000000002L27.14542,18.0094L25.24469,19.7527ZM35,16L35,20L44,20L44,16L35,16Z"
            fillRule="evenodd"
            fill="currentcolor"
            fillOpacity="1"
          />
        </g>
      </g>
    </svg>
  );
}

export const IconInsertColBefore = convertIcon(SvgComponent, 'insert_col_before');
