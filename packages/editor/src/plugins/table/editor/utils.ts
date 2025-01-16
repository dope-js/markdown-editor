import type { ElementType } from 'react';
import styles from './table-editor.module.scss';

export const AlignToTailwindClassMap = {
  center: styles.centeredCell,
  left: styles.leftAlignedCell,
  right: styles.rightAlignedCell,
};

export const getCellType = (rowIndex: number): ElementType => {
  if (rowIndex === 0) {
    return 'th';
  }
  return 'td';
};
