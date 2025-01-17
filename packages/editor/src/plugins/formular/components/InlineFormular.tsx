import { Popover } from '@douyinfe/semi-ui';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import { clsx } from 'clsx';
import type { LexicalEditor, BaseSelection, NodeKey } from 'lexical';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import type { FC } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { InlineMath } from 'react-katex';
import styles from './formular.module.scss';
import { $isFormularNode, type FormularNode } from '../FormularNode';
import { FormularEditor } from './FormularEditor';

interface InlineFormularProps {
  math: string;
  formularNode: FormularNode;
  nodeKey: NodeKey;
  parentEditor: LexicalEditor;
  isInsert?: boolean;
  autoFocus?: boolean;
}

export const InlineFormular: FC<InlineFormularProps> = ({
  math,
  formularNode,
  nodeKey,
  parentEditor,
  isInsert = false,
  autoFocus,
}) => {
  const [isSelected, setSelected, clearSelected] = useLexicalNodeSelection(nodeKey);
  const [editor] = useLexicalComposerContext();
  const [, setSelection] = useState<BaseSelection | null>(null);
  const activeEditorRef = useRef<LexicalEditor | null>(null);
  const formularRef = useRef<HTMLSpanElement | null>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isInsert || isMounted.current) return;
    clearSelected();
    setSelected(true);

    isMounted.current = true;
  }, [isInsert, isMounted.current, parentEditor, formularNode]);

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if ($isFormularNode(node)) {
          node.remove();
        }
      }
      return false;
    },
    [isSelected, nodeKey]
  );

  const isInFormular = useCallback(
    (target: HTMLElement | null) => {
      if (!target) return;
      if (target === formularRef.current) return true;

      if (isInFormular(target.parentElement)) return true;
      return false;
    },
    [formularRef.current]
  );

  useEffect(() => {
    let isMounted = true;

    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        if (isMounted) setSelection(editorState.read(() => $getSelection()));
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor;
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload;

          if (event.target instanceof HTMLElement && isInFormular(event.target)) {
            if (event.shiftKey) {
              setSelected(!isSelected);
            } else {
              clearSelected();
              setSelected(true);
            }
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(KEY_DELETE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW)
    );

    return () => {
      isMounted = false;
      unregister();
    };
  }, [editor, formularRef.current, setSelection, isSelected, setSelected, clearSelected, activeEditorRef.current]);

  return (
    <Popover
      position="top"
      trigger="custom"
      visible={isSelected}
      content={
        <FormularEditor
          math={math}
          autoFocus={autoFocus}
          onChange={(math: string) => {
            parentEditor.update(
              () => {
                formularNode.setValue(math);
                clearSelected();
              },
              { discrete: true }
            );
          }}
        />
      }
      showArrow
    >
      <span ref={formularRef} className={clsx(styles.wrapper, { [styles.selected]: isSelected })}>
        {math.trim() ? (
          <InlineMath math={math} errorColor="var(--color-danger)" />
        ) : (
          <span className={styles.empty}>Insert formular...</span>
        )}
      </span>
    </Popover>
  );
};
