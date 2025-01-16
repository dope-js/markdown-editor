import { EditorButton, IconRedo, IconUndo } from '@/components';
import { useEditor } from '@/contexts';
import { mergeRegister } from '@lexical/utils';
import { useCellValues } from '@mdxeditor/gurx';
import { CAN_REDO_COMMAND, CAN_UNDO_COMMAND, COMMAND_PRIORITY_CRITICAL, REDO_COMMAND, UNDO_COMMAND } from 'lexical';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { activeEditor$ } from '../../core';

/**
 * A toolbar component that lets the user undo and redo changes in the editor.
 * @group Toolbar Components
 */
export const UndoRedo: FC = () => {
  const [activeEditor] = useCellValues(activeEditor$);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const { t } = useEditor();

  useEffect(() => {
    if (activeEditor) {
      return mergeRegister(
        activeEditor.registerCommand<boolean>(
          CAN_UNDO_COMMAND,
          (payload) => {
            setCanUndo(payload);
            return false;
          },
          COMMAND_PRIORITY_CRITICAL
        ),
        activeEditor.registerCommand<boolean>(
          CAN_REDO_COMMAND,
          (payload) => {
            setCanRedo(payload);
            return false;
          },
          COMMAND_PRIORITY_CRITICAL
        )
      );
    }
  }, [activeEditor]);

  return (
    <>
      <EditorButton
        icon={<IconUndo />}
        disabled={!canUndo}
        title={t('toolbar.undo')}
        onClick={() => activeEditor?.dispatchCommand(UNDO_COMMAND, undefined)}
      />
      <EditorButton
        icon={<IconRedo />}
        disabled={!canRedo}
        title={t('toolbar.redo')}
        onClick={() => activeEditor?.dispatchCommand(REDO_COMMAND, undefined)}
      />
    </>
  );
};
