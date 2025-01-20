import {
  EditorButton,
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconDelete,
  IconInsertColAfter,
  IconInsertColBefore,
  IconMore,
} from '@/components';
import { useEditor } from '@/contexts';
import { Divider, Popover } from '@douyinfe/semi-ui';
import type { LexicalEditor } from 'lexical';
import type { AlignType } from 'mdast';
import type { FC } from 'react';
import { useCallback } from 'react';
import type { TableNode } from '../TableNode';

interface ColumnEditorProps {
  parentEditor: LexicalEditor;
  lexicalTable: TableNode;
  colIndex: number;
  highlightedCoordinates: [number, number];
  setActiveCellWithBoundaries: (cell: [number, number] | null) => void;
  align: AlignType;
}

export const ColumnEditor: FC<ColumnEditorProps> = ({
  parentEditor,
  highlightedCoordinates,
  align = 'left',
  lexicalTable,
  colIndex,
  setActiveCellWithBoundaries,
}) => {
  const { t } = useEditor();

  const insertColumnAt = useCallback(
    (colIndex: number) => {
      parentEditor.update(() => {
        lexicalTable.insertColumnAt(colIndex);
      });
      setActiveCellWithBoundaries([colIndex, 0]);
    },
    [parentEditor, lexicalTable, setActiveCellWithBoundaries]
  );

  const deleteColumnAt = useCallback(
    (colIndex: number) => {
      parentEditor.update(() => {
        lexicalTable.deleteColumnAt(colIndex);
      });
    },
    [parentEditor, lexicalTable]
  );

  const setColumnAlign = useCallback(
    (colIndex: number, align: AlignType) => {
      parentEditor.update(() => {
        lexicalTable.setColumnAlign(colIndex, align);
      });
    },
    [parentEditor, lexicalTable]
  );

  return (
    <Popover
      trigger="click"
      position="top"
      showArrow
      className="dme-table-menu"
      contentClassName="dme-table-menu-content"
      content={
        <>
          <EditorButton
            size="small"
            title={t('table.align.left')}
            icon={<IconAlignLeft />}
            active={align === 'left'}
            onClick={() => setColumnAlign(colIndex, 'left')}
          />
          <EditorButton
            size="small"
            title={t('table.align.center')}
            icon={<IconAlignCenter />}
            active={align === 'center'}
            onClick={() => setColumnAlign(colIndex, 'center')}
          />
          <EditorButton
            size="small"
            title={t('table.align.right')}
            icon={<IconAlignRight />}
            active={align === 'right'}
            onClick={() => setColumnAlign(colIndex, 'right')}
          />
          <Divider layout="vertical" />
          <EditorButton
            size="small"
            title={t('table.column.insert.before')}
            icon={<IconInsertColBefore />}
            onClick={() => insertColumnAt(colIndex)}
          />
          <EditorButton
            size="small"
            title={t('table.column.insert.after')}
            icon={<IconInsertColAfter />}
            onClick={() => insertColumnAt(colIndex + 1)}
          />
          <EditorButton
            size="small"
            title={t('table.column.delete')}
            icon={<IconDelete />}
            onClick={() => deleteColumnAt(colIndex)}
          />
        </>
      }
    >
      <div>
        <EditorButton minor={highlightedCoordinates[0] !== colIndex + 1} size="small" icon={<IconMore />} />
      </div>
    </Popover>
  );
};
