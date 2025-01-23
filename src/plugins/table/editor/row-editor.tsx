import { EditorButton, IconDelete, IconInsertRowAfter, IconInsertRowBefore, IconMore, Popover } from '@/components';
import { useEditor } from '@/contexts';
import type { LexicalEditor } from 'lexical';
import type { FC } from 'react';
import { useCallback } from 'react';
import type { TableNode } from '../TableNode';

interface RowEditorProps {
  parentEditor: LexicalEditor;
  lexicalTable: TableNode;
  rowIndex: number;
  highlightedCoordinates: [number, number];
  setActiveCellWithBoundaries: (cell: [number, number] | null) => void;
}

export const RowEditor: FC<RowEditorProps> = ({
  parentEditor,
  highlightedCoordinates,
  lexicalTable,
  rowIndex,
  setActiveCellWithBoundaries,
}) => {
  const { t } = useEditor();

  const insertRowAt = useCallback(
    (rowIndex: number) => {
      parentEditor.update(() => {
        lexicalTable.insertRowAt(rowIndex);
      });
      setActiveCellWithBoundaries([0, rowIndex]);
    },
    [parentEditor, lexicalTable, setActiveCellWithBoundaries]
  );

  const deleteRowAt = useCallback(
    (rowIndex: number) => {
      parentEditor.update(() => {
        lexicalTable.deleteRowAt(rowIndex);
      });
    },
    [parentEditor, lexicalTable]
  );

  return (
    <Popover
      trigger="click"
      position="right"
      className="dme-table-menu"
      contentClassName="dme-table-menu-content"
      content={
        <>
          <EditorButton
            size="small"
            title={t('table.row.insert.before')}
            icon={<IconInsertRowBefore />}
            onClick={() => insertRowAt(rowIndex)}
          />
          <EditorButton
            size="small"
            title={t('table.row.insert.after')}
            icon={<IconInsertRowAfter />}
            onClick={() => insertRowAt(rowIndex + 1)}
          />
          <EditorButton
            title={t('table.row.delete')}
            size="small"
            icon={<IconDelete />}
            onClick={() => deleteRowAt(rowIndex)}
          />
        </>
      }
    >
      <div>
        <EditorButton
          minor={highlightedCoordinates[1] !== rowIndex}
          icon={<IconMore />}
          size="small"
          block
          style={{ height: '100%' }}
        />
      </div>
    </Popover>
  );
};
