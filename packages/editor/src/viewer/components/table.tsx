import type { FC, HTMLAttributes } from 'react';

export const Table: FC<HTMLAttributes<HTMLTableElement>> = (props) => {
  return (
    <div className="dme-viewer-table">
      <table {...props} />
    </div>
  );
};
