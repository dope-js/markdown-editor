import type { FC, HTMLAttributes } from 'react';

export const Table: FC<HTMLAttributes<HTMLTableElement>> = (props) => {
  return (
    <div className="dmv-table">
      <table {...props} />
    </div>
  );
};
