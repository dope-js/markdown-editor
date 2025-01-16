import { EditorButton, IconDelete, IconPlus } from '@/components';
import { useEditor } from '@/contexts';
import { uuidv4 } from '@/utils';
import { useCellValues } from '@mdxeditor/gurx';
import type { LexicalEditor } from 'lexical';
import { $createParagraphNode } from 'lexical';
import type * as Mdast from 'mdast';
import type { FC, MouseEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { TableNode } from '../TableNode';
import { Cell } from './cell';
import { ColumnEditor } from './col-editor';
import { RowEditor } from './row-editor';
import styles from './table-editor.module.scss';
import { AlignToTailwindClassMap, getCellType } from './utils';
import { readOnly$ } from '../../core';

export interface TableEditorProps {
  parentEditor: LexicalEditor;
  lexicalTable: TableNode;
  mdastNode: Mdast.Table;
}

export const TableEditor: FC<TableEditorProps> = ({ mdastNode, parentEditor, lexicalTable }) => {
  const [activeCell, setActiveCell] = useState<[number, number] | null>(null);
  const [readOnly] = useCellValues(readOnly$);

  const { t } = useEditor();

  const getCellKey = useMemo(() => {
    return (cell: Mdast.TableCell & { __cacheKey?: string }) => {
      if (!cell.__cacheKey) {
        cell.__cacheKey = uuidv4();
      }
      return cell.__cacheKey;
    };
  }, []);

  const setActiveCellWithBoundaries = useCallback(
    (cell: [number, number] | null) => {
      const colCount = lexicalTable.getColCount();

      if (cell === null) {
        setActiveCell(null);
        return;
      }
      let [colIndex, rowIndex] = cell;

      // overflow columns
      if (colIndex > colCount - 1) {
        colIndex = 0;
        rowIndex++;
      }

      // underflow columns
      if (colIndex < 0) {
        colIndex = colCount - 1;
        rowIndex -= 1;
      }

      if (rowIndex > lexicalTable.getRowCount() - 1) {
        setActiveCell(null);
        parentEditor.update(() => {
          const nextSibling = lexicalTable.getLatest().getNextSibling();
          if (nextSibling) {
            lexicalTable.getLatest().selectNext();
          } else {
            const newParagraph = $createParagraphNode();
            lexicalTable.insertAfter(newParagraph);
            newParagraph.select();
          }
        });
        return;
      }

      if (rowIndex < 0) {
        setActiveCell(null);
        parentEditor.update(() => {
          lexicalTable.getLatest().selectPrevious();
        });
        return;
      }

      setActiveCell([colIndex, rowIndex]);
    },
    [lexicalTable, parentEditor]
  );

  useEffect(() => {
    lexicalTable.focusEmitter.subscribe(setActiveCellWithBoundaries);
  }, [lexicalTable, setActiveCellWithBoundaries]);

  const addRowToBottom = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      parentEditor.update(() => {
        lexicalTable.addRowToBottom();
        setActiveCell([0, lexicalTable.getRowCount()]);
      });
    },
    [parentEditor, lexicalTable]
  );

  // adds column to the right and focuses the top cell of it
  const addColumnToRight = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      parentEditor.update(() => {
        lexicalTable.addColumnToRight();
        setActiveCell([lexicalTable.getColCount(), 0]);
      });
    },
    [parentEditor, lexicalTable]
  );

  const [highlightedCoordinates, setHighlightedCoordinates] = useState<[number, number]>([-1, -1]);

  const onTableMouseOver = useCallback((e: MouseEvent<HTMLTableElement>) => {
    let tableCell = e.target as HTMLElement | null;

    while (tableCell && !['th', 'td'].includes(tableCell.tagName.toLowerCase())) {
      if (tableCell === e.currentTarget) return;
      tableCell = tableCell.parentElement;
    }

    if (tableCell === null) return;

    const tableRow = tableCell.parentElement!;
    const tableContainer = tableRow.parentElement!;

    const colIndex =
      tableContainer.tagName.toLowerCase() === 'tfoot' ? -1 : Array.from(tableRow.children).indexOf(tableCell);

    const rowIndex =
      tableCell.getAttribute('data-tool-cell') === 'true' || tableContainer.tagName.toLowerCase() !== 'tbody'
        ? -1
        : Array.from(tableRow.parentElement!.children).indexOf(tableRow);

    setHighlightedCoordinates([colIndex, rowIndex]);
  }, []);

  // remove tool cols in readOnly mode
  return (
    <table
      className={styles.tableEditor}
      onMouseOver={onTableMouseOver}
      onMouseLeave={() => setHighlightedCoordinates([-1, -1])}
    >
      <colgroup>
        {readOnly ? null : <col />}
        {Array.from({ length: mdastNode.children[0].children.length }, (_, colIndex) => {
          const align = mdastNode.align ?? [];
          const currentColumnAlign = align[colIndex] ?? 'left';
          const className = AlignToTailwindClassMap[currentColumnAlign];
          return <col key={colIndex} className={className} />;
        })}
        {readOnly ? null : <col />}
      </colgroup>

      {readOnly || (
        <thead>
          <tr>
            <th className={styles.tableToolsColumn}></th>
            {Array.from({ length: mdastNode.children[0].children.length }, (_, colIndex) => {
              return (
                <th key={colIndex} data-tool-cell={true}>
                  <ColumnEditor
                    {...{
                      setActiveCellWithBoundaries,
                      parentEditor,
                      colIndex,
                      highlightedCoordinates,
                      lexicalTable,
                      align: (mdastNode.align ?? [])[colIndex],
                    }}
                  />
                </th>
              );
            })}
            <th className={styles.tableToolsColumn} data-tool-cell={true}>
              <EditorButton
                icon={<IconDelete />}
                title={t('table.remove')}
                size="small"
                minor
                onClick={(e) => {
                  e.preventDefault();
                  parentEditor.update(() => {
                    lexicalTable.selectNext();
                    lexicalTable.remove();
                  });
                }}
              />
            </th>
          </tr>
        </thead>
      )}

      <tbody>
        {mdastNode.children.map((row, rowIndex) => {
          const CellElement = getCellType(rowIndex);
          return (
            <tr key={rowIndex}>
              {readOnly || (
                <CellElement className={styles.toolCell} data-tool-cell={true}>
                  <RowEditor
                    {...{ setActiveCellWithBoundaries, parentEditor, rowIndex, highlightedCoordinates, lexicalTable }}
                  />
                </CellElement>
              )}
              {row.children.map((mdastCell, colIndex) => {
                return (
                  <Cell
                    align={mdastNode.align?.[colIndex]}
                    key={getCellKey(mdastCell)}
                    contents={mdastCell.children}
                    setActiveCell={setActiveCellWithBoundaries}
                    {...{
                      rowIndex,
                      colIndex,
                      lexicalTable,
                      parentEditor,
                      activeCell: readOnly ? [-1, -1] : activeCell,
                    }}
                  />
                );
              })}
              {readOnly ||
                (rowIndex === 0 && (
                  <th rowSpan={lexicalTable.getRowCount()} data-tool-cell={true}>
                    <EditorButton
                      block
                      minor
                      icon={<IconPlus />}
                      title={t('table.column.add')}
                      style={{ height: '100%' }}
                      size="small"
                      onClick={addColumnToRight}
                    />
                  </th>
                ))}
            </tr>
          );
        })}
      </tbody>
      {readOnly || (
        <tfoot>
          <tr>
            <th></th>
            <th colSpan={lexicalTable.getColCount()}>
              <EditorButton
                size="small"
                minor
                icon={<IconPlus />}
                title={t('table.row.add')}
                onClick={addRowToBottom}
              ></EditorButton>
            </th>
            <th></th>
          </tr>
        </tfoot>
      )}
    </table>
  );
};
