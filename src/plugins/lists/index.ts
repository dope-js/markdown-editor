import { defineEditorPlugin } from '@/utils';
import type { ListType } from '@lexical/list';
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
  REMOVE_LIST_COMMAND,
  $getListDepth,
  $isListItemNode,
  $isListNode,
} from '@lexical/list';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';

import { $findMatchingParent, $getNearestNodeOfType } from '@lexical/utils';

import { Cell, Signal, withLatestFrom } from '@mdxeditor/gurx';
import {
  $isRootOrShadowRoot,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  INDENT_CONTENT_COMMAND,
} from 'lexical';
import type { LexicalCommand, RangeSelection, ElementNode } from 'lexical';
import { gfmTaskListItemFromMarkdown, gfmTaskListItemToMarkdown } from 'mdast-util-gfm-task-list-item';
import { gfmTaskListItem } from 'micromark-extension-gfm-task-list-item';
import { LexicalListItemVisitor } from './LexicalListItemVisitor';
import { LexicalListVisitor } from './LexicalListVisitor';
import { MdastListItemVisitor } from './MdastListItemVisitor';
import { MdastListVisitor } from './MdastListVisitor';
import {
  activeEditor$,
  addActivePlugin$,
  addComposerChild$,
  addExportVisitor$,
  addImportVisitor$,
  addLexicalNode$,
  addMdastExtension$,
  addNestedEditorChild$,
  addSyntaxExtension$,
  addToMarkdownExtension$,
  currentSelection$,
  rootEditor$,
} from '../core';

const ListTypeCommandMap = new Map<ListType | '', LexicalCommand<void>>([
  ['number', INSERT_ORDERED_LIST_COMMAND],
  ['bullet', INSERT_UNORDERED_LIST_COMMAND],
  ['check', INSERT_CHECK_LIST_COMMAND],
  ['', REMOVE_LIST_COMMAND],
]);

/**
 * The current list type in the editor.
 * @group Lists
 */
export const currentListType$ = Cell<ListType | ''>('', (r) => {
  r.sub(r.pipe(currentSelection$, withLatestFrom(activeEditor$)), ([selection, theEditor]) => {
    if (!selection || !theEditor) {
      return;
    }

    const anchorNode = selection.anchor.getNode();
    let element =
      anchorNode.getKey() === 'root'
        ? anchorNode
        : $findMatchingParent(anchorNode, (e) => {
            const parent = e.getParent();
            return parent !== null && $isRootOrShadowRoot(parent);
          });

    if (element === null) {
      element = anchorNode.getTopLevelElementOrThrow();
    }

    const elementKey = element.getKey();
    const elementDOM = theEditor.getElementByKey(elementKey);

    if (elementDOM !== null) {
      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
        const type = parentList ? parentList.getListType() : element.getListType();
        r.pub(currentListType$, type);
      } else {
        r.pub(currentListType$, '');
      }
    }
  });
});

/**
 * Converts the current selection to the specified list type.
 * @group Lists
 */
export const applyListType$ = Signal<ListType | ''>((r) => {
  r.sub(r.pipe(applyListType$, withLatestFrom(activeEditor$)), ([listType, theEditor]) => {
    theEditor?.dispatchCommand(ListTypeCommandMap.get(listType)!, undefined);
  });
});

/**
 * A plugin that adds support for markdown lists.
 * @group Lists
 */
export const listsPlugin = defineEditorPlugin({
  init(realm) {
    realm
      .getValue(rootEditor$)
      ?.registerCommand(INDENT_CONTENT_COMMAND, () => !isIndentPermitted(7), COMMAND_PRIORITY_CRITICAL);

    realm.pubIn({
      [addActivePlugin$]: 'lists',
      [addMdastExtension$]: gfmTaskListItemFromMarkdown(),
      [addSyntaxExtension$]: gfmTaskListItem(),
      [addImportVisitor$]: [MdastListVisitor, MdastListItemVisitor],
      [addLexicalNode$]: [ListItemNode, ListNode],
      [addExportVisitor$]: [LexicalListVisitor, LexicalListItemVisitor],
      [addToMarkdownExtension$]: gfmTaskListItemToMarkdown(),
      [addComposerChild$]: [TabIndentationPlugin, ListPlugin, CheckListPlugin],
      [addNestedEditorChild$]: [TabIndentationPlugin, ListPlugin, CheckListPlugin],
    });
  },
});

// Taken from the list indent plugin of the Lexical playground
function getElementNodesInSelection(selection: RangeSelection): Set<ElementNode> {
  const nodesInSelection = selection.getNodes();

  if (nodesInSelection.length === 0) {
    return new Set([selection.anchor.getNode().getParentOrThrow(), selection.focus.getNode().getParentOrThrow()]);
  }

  return new Set(nodesInSelection.map((n) => ($isElementNode(n) ? n : n.getParentOrThrow())));
}

function isIndentPermitted(maxDepth: number): boolean {
  const selection = $getSelection();

  if (!$isRangeSelection(selection)) {
    return false;
  }

  const elementNodesInSelection: Set<ElementNode> = getElementNodesInSelection(selection);

  let totalDepth = 0;

  for (const elementNode of elementNodesInSelection) {
    if ($isListNode(elementNode)) {
      totalDepth = Math.max($getListDepth(elementNode) + 1, totalDepth);
    } else if ($isListItemNode(elementNode)) {
      const parent = elementNode.getParent();

      // prevent multiple level indentation, markdown does not support it
      if (parent?.getChildren().length === 1) {
        const grandParentListItem = parent.getParent();
        if ($isListItemNode(grandParentListItem) && grandParentListItem.getChildren().length === 1) {
          return false;
        }
      }

      if (!$isListNode(parent)) {
        throw new Error('ListMaxIndentLevelPlugin: A ListItemNode must have a ListNode for a parent.');
      }

      totalDepth = Math.max($getListDepth(parent) + 1, totalDepth);
    }
  }

  return totalDepth <= maxDepth;
}
