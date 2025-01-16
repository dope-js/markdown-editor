import type { LexicalExportVisitor } from '@/utils';
import type { MdxJsxFlowElement, MdxJsxTextElement } from 'mdast-util-mdx-jsx';
import type { GenericHTMLNode } from './GenericHTMLNode';
import { $isGenericHTMLNode } from './GenericHTMLNode';

export const LexicalGenericHTMLVisitor: LexicalExportVisitor<GenericHTMLNode, MdxJsxFlowElement | MdxJsxTextElement> = {
  testLexicalNode: $isGenericHTMLNode,
  visitLexicalNode({ actions, lexicalNode }) {
    actions.addAndStepInto('mdxJsxTextElement', {
      name: lexicalNode.getTag(),
      type: lexicalNode.getNodeType(),
      attributes: lexicalNode.getAttributes(),
    });
  },
  priority: -100,
};
