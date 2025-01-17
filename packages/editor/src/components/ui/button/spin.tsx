import { useMemo } from 'react';

let _id = -1;

export interface IconProps {
  id?: number;
  component?: React.ReactNode;
  size?: number;
  className?: string;
  type?: string;
}

export function SpinIcon(props: IconProps) {
  const { id: propsId, className, ...rest } = props;

  const _propsId = useMemo(() => {
    if (propsId !== undefined || propsId !== null) {
      return propsId;
    }

    return ++_id;
  }, [propsId]);

  const id = useMemo(() => `linearGradient-${_propsId}`, [_propsId]);

  return (
    <svg
      {...rest}
      className={className}
      width="48"
      height="48"
      viewBox="0 0 36 36"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      data-icon="spin"
    >
      <defs>
        <linearGradient x1="0%" y1="100%" x2="100%" y2="100%" id={id}>
          <stop stopColor="currentColor" stopOpacity="0" offset="0%" />
          <stop stopColor="currentColor" stopOpacity="0.50" offset="39.9430698%" />
          <stop stopColor="currentColor" offset="100%" />
        </linearGradient>
      </defs>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <rect fillOpacity="0.01" fill="none" x="0" y="0" width="36" height="36" />
        <path
          d="M34,18 C34,9.163444 26.836556,2 18,2 C11.6597233,2 6.18078805,5.68784135 3.59122325,11.0354951"
          stroke={`url(#${id})`}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
