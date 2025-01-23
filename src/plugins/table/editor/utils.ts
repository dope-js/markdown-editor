import type { ElementType } from 'react';

export const AlignToTailwindClassMap = {
  center: 'dme-table-centered-cell',
  left: 'dme-table-left-aligned-cell',
  right: 'dme-table-right-aligned-cell',
};

export const getCellType = (rowIndex: number): ElementType => {
  if (rowIndex === 0) {
    return 'th';
  }
  return 'td';
};
