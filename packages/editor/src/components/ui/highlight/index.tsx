import type { FC } from 'react';

interface IHighlightProps {
  value: string;
  keyword: string;
}

export const Highlight: FC<IHighlightProps> = ({ value, keyword }) => {
  return value.split(new RegExp(`(${keyword})`, 'gi')).map((c, i) => {
    console.log(c, keyword);
    return c.toLowerCase() === keyword.toLowerCase() ? (
      <span className="dme-highlight" key={i}>
        {c}
      </span>
    ) : (
      c
    );
  });
};
