import { defineEditorPlugin } from '@/utils';
import { HorizontalRuleNode, INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { Action, withLatestFrom } from '@mdxeditor/gurx';
import { activeEditor$, addComposerChild$, addExportVisitor$, addImportVisitor$, addLexicalNode$ } from '../core';
import { LexicalThematicBreakVisitor } from './LexicalThematicBreakVisitor';
import { MdastThematicBreakVisitor } from './MdastThematicBreakVisitor';

/**
 * Inserts a thematic break at the current selection.
 * @group Thematic Break
 */
export const insertThematicBreak$ = Action((r) => {
  r.sub(r.pipe(insertThematicBreak$, withLatestFrom(activeEditor$)), ([, theEditor]) => {
    theEditor?.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
  });
});

/**
 * A plugin that adds support for thematic breaks.
 * @group Thematic Break
 */
export const thematicBreakPlugin = defineEditorPlugin({
  init(realm) {
    realm.pubIn({
      [addImportVisitor$]: MdastThematicBreakVisitor,
      [addLexicalNode$]: HorizontalRuleNode,
      [addExportVisitor$]: LexicalThematicBreakVisitor,
      [addComposerChild$]: HorizontalRulePlugin,
    });
  },
});
