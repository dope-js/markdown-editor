import { defineEditorPlugin } from '@/utils';
import { trimTextContentFromAnchor } from '@lexical/selection';
import { $restoreEditorState } from '@lexical/utils';
import type { EditorState } from 'lexical';
import { $getSelection, $isRangeSelection, RootNode } from 'lexical';
import { createRootEditorSubscription$ } from '../core';

export const maxLengthPlugin = defineEditorPlugin<number>({
  init: (realm, maxLength = Infinity) => {
    realm.pub(createRootEditorSubscription$, (editor) => {
      let lastRestoredEditorState: EditorState | null = null;

      return editor.registerNodeTransform(RootNode, (rootNode: RootNode) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
          return;
        }
        const prevEditorState = editor.getEditorState();
        const prevTextContentSize = prevEditorState.read(() => rootNode.getTextContentSize());
        const textContentSize = rootNode.getTextContentSize();
        if (prevTextContentSize !== textContentSize) {
          const delCount = textContentSize - maxLength;
          const anchor = selection.anchor;

          if (delCount > 0) {
            // Restore the old editor state instead if the last
            // text content was already at the limit.
            if (prevTextContentSize === maxLength && lastRestoredEditorState !== prevEditorState) {
              lastRestoredEditorState = prevEditorState;
              $restoreEditorState(editor, prevEditorState);
            } else {
              trimTextContentFromAnchor(editor, anchor, delCount);
            }
          }
        }
      });
    });
  },
});
