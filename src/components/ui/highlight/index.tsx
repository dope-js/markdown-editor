import type { FC } from 'react';

interface IHighlightProps {
  value: string;
  keyword: string;
}

export const Highlight: FC<IHighlightProps> = ({ value, keyword }) => {
  if (!keyword) return value;

  return value.split(new RegExp(`(${keyword})`, 'gi')).map((c, i) => {
    return c.toLowerCase() === keyword.toLowerCase() ? (
      <span className="dme-highlight" key={i}>
        {c}
      </span>
    ) : (
      c
    );
  });
};
