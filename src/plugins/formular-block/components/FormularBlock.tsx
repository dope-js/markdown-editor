import { Divider, EditorButton, FormularModal, IconDelete, IconEdit, Popover } from '@/components';
import { useEditor } from '@/contexts';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import { clsx } from 'clsx';
import type { BaseSelection, LexicalEditor, NodeKey } from 'lexical';
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
import { BlockMath } from 'react-katex';
import { $isFormularBlockNode, type FormularBlockNode } from '../FormularBlockNode';

import './formular.scss';

interface IFormularBlockProps {
  math: string;
  formularNode: FormularBlockNode;
  nodeKey: NodeKey;
  parentEditor: LexicalEditor;
}

export const FormularBlock: FC<IFormularBlockProps> = ({ math, nodeKey, formularNode, parentEditor }) => {
  const [isSelected, setSelected, clearSelected] = useLexicalNodeSelection(nodeKey);
  const formularRef = useRef<HTMLDivElement | null>(null);
  const [editor] = useLexicalComposerContext();
  const [, setSelection] = useState<BaseSelection | null>(null);
  const activeEditorRef = useRef<LexicalEditor | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { t } = useEditor();

  const isInFormular = useCallback(
    (target: HTMLElement | null) => {
      if (!target) return;
      if (target === formularRef.current) return true;

      if (isInFormular(target.parentElement)) return true;
      return false;
    },
    [formularRef.current]
  );

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if ($isFormularBlockNode(node)) {
          node.remove();
        }
      }
      return false;
    },
    [isSelected, nodeKey]
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
    <>
      <Popover
        trigger="custom"
        visible={isSelected}
        position="top"
        className="dme-formular-block-menu"
        contentClassName="dme-formular-block-menu-content"
        content={
          <>
            <EditorButton
              title={t('formular.edit')}
              size="small"
              icon={<IconEdit />}
              onClick={() => {
                setModalVisible(true);
                setSelected(false);
              }}
            />
            <Divider layout="vertical" />
            <EditorButton
              title={t('formular.remove')}
              size="small"
              icon={<IconDelete />}
              onClick={(e) => {
                e.preventDefault();
                parentEditor.update(() => {
                  formularNode.remove();
                });
              }}
            />
          </>
        }
      >
        <div
          ref={formularRef}
          className={clsx('dme-formular-block-wrapper', { 'dme-formular-block-selected': isSelected })}
        >
          {math.trim() ? (
            <BlockMath math={math} />
          ) : (
            <span className="dme-formular-block-empty" onClick={() => setModalVisible(true)}>
              Insert formular...
            </span>
          )}
        </div>
      </Popover>
      {modalVisible && (
        <FormularModal
          title={t('formular.edit')}
          visible={modalVisible}
          setVisible={setModalVisible}
          math={math}
          setMath={(math) => {
            parentEditor.update(
              () => {
                formularNode.setValue(math);
                clearSelected();
              },
              { discrete: true }
            );
            setModalVisible(false);
          }}
        />
      )}
    </>
  );
};
