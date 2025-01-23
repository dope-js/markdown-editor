import { exportLexicalTreeToMdast, importMdastTreeToLexical, isPartOftheEditorUI, lexicalTheme } from '@/utils';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { mergeRegister } from '@lexical/utils';
import { useCellValues } from '@mdxeditor/gurx';
import {
  $getRoot,
  BLUR_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_LOW,
  FOCUS_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_TAB_COMMAND,
  createEditor,
} from 'lexical';
import type { Paragraph } from 'mdast';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import type { CellProps } from './cell';
import {
  nestedEditorUpdatedCommand,
  codeBlockEditorDescriptors$,
  exportVisitors$,
  importVisitors$,
  jsxIsAvailable$,
  rootEditor$,
  usedLexicalNodes$,
} from '../../core';

export const CellEditor: FC<CellProps> = ({
  focus,
  setActiveCell,
  parentEditor,
  lexicalTable,
  contents,
  colIndex,
  rowIndex,
}) => {
  const [importVisitors, exportVisitors, usedLexicalNodes, codeBlockEditorDescriptors, jsxIsAvailable, rootEditor] =
    useCellValues(
      importVisitors$,
      exportVisitors$,
      usedLexicalNodes$,
      codeBlockEditorDescriptors$,
      jsxIsAvailable$,
      rootEditor$
    );

  const [editor] = useState(() => {
    const editor = createEditor({
      nodes: usedLexicalNodes,
      theme: lexicalTheme,
    });

    editor.update(() => {
      importMdastTreeToLexical({
        root: $getRoot(),
        mdastRoot: { type: 'root', children: [{ type: 'paragraph', children: contents }] },
        visitors: importVisitors,
        codeBlockEditorDescriptors,
      });
    });

    return editor;
  });

  const saveAndFocus = useCallback(
    (nextCell: [number, number] | null) => {
      editor.getEditorState().read(() => {
        const mdast = exportLexicalTreeToMdast({
          root: $getRoot(),
          visitors: exportVisitors,
          jsxIsAvailable,
        });
        parentEditor.update(
          () => {
            lexicalTable.updateCellContents(colIndex, rowIndex, (mdast.children[0] as Paragraph).children);
          },
          { discrete: true }
        );
        parentEditor.dispatchCommand(nestedEditorUpdatedCommand, undefined);
      });

      setActiveCell(nextCell);
    },
    [colIndex, editor, exportVisitors, jsxIsAvailable, lexicalTable, parentEditor, rowIndex, setActiveCell]
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        KEY_TAB_COMMAND,
        (payload) => {
          payload.preventDefault();
          const nextCell: [number, number] = payload.shiftKey ? [colIndex - 1, rowIndex] : [colIndex + 1, rowIndex];
          saveAndFocus(nextCell);
          return true;
        },
        COMMAND_PRIORITY_CRITICAL
      ),

      editor.registerCommand(
        FOCUS_COMMAND,
        () => {
          setActiveCell([colIndex, rowIndex]);
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),

      editor.registerCommand(
        KEY_ENTER_COMMAND,
        (payload) => {
          payload?.preventDefault();
          const nextCell: [number, number] = payload?.shiftKey ? [colIndex, rowIndex - 1] : [colIndex, rowIndex + 1];
          saveAndFocus(nextCell);
          return true;
        },
        COMMAND_PRIORITY_CRITICAL
      ),

      editor.registerCommand(
        BLUR_COMMAND,
        (payload) => {
          const relatedTarget = payload.relatedTarget as HTMLElement | null;

          if (isPartOftheEditorUI(relatedTarget, rootEditor!.getRootElement()!)) {
            return false;
          }
          saveAndFocus(null);
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),

      editor.registerCommand(
        nestedEditorUpdatedCommand,
        () => {
          saveAndFocus(null);
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [colIndex, editor, rootEditor, rowIndex, saveAndFocus, setActiveCell]);

  useEffect(() => {
    if (focus) editor.focus();
  }, [focus, editor]);

  return (
    <LexicalNestedComposer initialEditor={editor}>
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div></div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
    </LexicalNestedComposer>
  );
};
