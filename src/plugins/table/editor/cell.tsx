import type { LexicalEditor } from 'lexical';
import type { AlignType, PhrasingContent } from 'mdast';
import type { FC } from 'react';
import type { TableNode } from '../TableNode';
import { CellEditor } from './cell-editor';
import { AlignToTailwindClassMap, getCellType } from './utils';

export interface CellProps {
  parentEditor: LexicalEditor;
  lexicalTable: TableNode;
  contents: PhrasingContent[];
  colIndex: number;
  rowIndex: number;
  align?: AlignType;
  activeCell: [number, number] | null;
  setActiveCell: (cell: [number, number] | null) => void;
  focus: boolean;
}

export const Cell: FC<Omit<CellProps, 'focus'>> = ({ align, ...props }) => {
  const { activeCell, setActiveCell } = props;
  const isActive = Boolean(activeCell && activeCell[0] === props.colIndex && activeCell[1] === props.rowIndex);

  const className = AlignToTailwindClassMap[align ?? 'left'];

  const CellElement = getCellType(props.rowIndex);

  return (
    <CellElement
      className={className}
      data-active={isActive}
      onClick={() => {
        setActiveCell([props.colIndex, props.rowIndex]);
      }}
    >
      <CellEditor {...props} focus={isActive} />
    </CellElement>
  );
};
