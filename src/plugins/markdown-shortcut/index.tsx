import { defineEditorPlugin } from '@/utils';
import type { ElementTransformer, Transformer } from '@lexical/markdown';
import {
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  CHECK_LIST,
  INLINE_CODE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  LINK,
  ORDERED_LIST,
  QUOTE,
  STRIKETHROUGH,
  UNORDERED_LIST,
} from '@lexical/markdown';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import type { HeadingTagType } from '@lexical/rich-text';
import { $createHeadingNode, $isHeadingNode, HeadingNode } from '@lexical/rich-text';
import type { ElementNode } from 'lexical';
import { activePlugins$, addComposerChild$, addNestedEditorChild$ } from '../core';
import type { HEADING_LEVEL } from '../headings';
import { allowedHeadingLevels$ } from '../headings';
import { codeTransformerCopy } from './codeblock';
import { formularTransformer } from './fomular';
import { formularBlockTransform } from './formular-block';

/**
 * A plugin that adds markdown shortcuts to the editor.
 * @group Markdown Shortcuts
 */
export const markdownShortcutPlugin = defineEditorPlugin({
  init(realm) {
    const pluginIds = realm.getValue(activePlugins$);
    const allowedHeadingLevels: readonly HEADING_LEVEL[] = pluginIds.includes('headings')
      ? realm.getValue(allowedHeadingLevels$)
      : [];
    const transformers = pickTransformersForActivePlugins(pluginIds, allowedHeadingLevels);
    realm.pubIn({
      [addComposerChild$]: () => <MarkdownShortcutPlugin transformers={transformers} />,
      [addNestedEditorChild$]: () => <MarkdownShortcutPlugin transformers={transformers} />,
    });
  },
});

const createBlockNode = (createNode: (match: string[]) => ElementNode): ElementTransformer['replace'] => {
  return (parentNode, children, match) => {
    const node = createNode(match);
    node.append(...children);
    parentNode.replace(node);
    node.select(0, 0);
  };
};

function pickTransformersForActivePlugins(pluginIds: string[], allowedHeadingLevels: readonly HEADING_LEVEL[]) {
  const transformers: Transformer[] = [
    BOLD_ITALIC_STAR,
    BOLD_ITALIC_UNDERSCORE,
    BOLD_STAR,
    BOLD_UNDERSCORE,
    INLINE_CODE,
    ITALIC_STAR,
    ITALIC_UNDERSCORE,
    STRIKETHROUGH,
  ];

  if (pluginIds.includes('headings')) {
    // Using a range is technically a bug, because the developer might have allowed h2 and h4, but not h3.
    // However, it's a very unlikely edge case.
    const minHeadingLevel = Math.min(...allowedHeadingLevels);
    const maxHeadingLevel = Math.max(...allowedHeadingLevels);
    const headingRegExp = new RegExp(`^(#{${minHeadingLevel},${maxHeadingLevel}})\\s`);

    const HEADING: ElementTransformer = {
      dependencies: [HeadingNode],
      export: (node, exportChildren) => {
        if (!$isHeadingNode(node)) {
          return null;
        }
        const level = Number(node.getTag().slice(1));
        return '#'.repeat(level) + ' ' + exportChildren(node);
      },
      regExp: headingRegExp,
      replace: createBlockNode((match) => {
        const tag = `h${match[1].length}` as HeadingTagType;
        return $createHeadingNode(tag);
      }),
      type: 'element',
    };
    transformers.push(HEADING);
  }

  if (pluginIds.includes('quote')) {
    transformers.push(QUOTE);
  }

  if (pluginIds.includes('link')) {
    transformers.push(LINK);
  }
  if (pluginIds.includes('lists')) {
    transformers.push(ORDERED_LIST, UNORDERED_LIST, CHECK_LIST);
  }

  if (pluginIds.includes('codeblock')) {
    transformers.push(codeTransformerCopy);
  }

  if (pluginIds.includes('formular')) {
    transformers.push(formularTransformer);
  }

  if (pluginIds.includes('formular-block')) {
    transformers.push(formularBlockTransform);
  }

  return transformers;
}
