import type { LexicalExportVisitor } from '@/utils';
import type * as Mdast from 'mdast';
import type { MdxJsxAttribute, MdxJsxExpressionAttribute } from 'mdast-util-mdx-jsx';
import type { ImageNode } from './node';
import { $isImageNode } from './node';

export const LexicalImageVisitor: LexicalExportVisitor<ImageNode, Mdast.Image> = {
  testLexicalNode: $isImageNode,
  visitLexicalNode({ mdastParent, lexicalNode, actions }) {
    // if the lexicalNode has height or width different than inherit, append it as an html
    if (lexicalNode.shouldBeSerializedAsElement()) {
      const attrs: (MdxJsxAttribute | MdxJsxExpressionAttribute)[] = [];

      if (lexicalNode.getHeight() !== 'inherit') {
        attrs.push({
          type: 'mdxJsxAttribute',
          name: 'height',
          value: { type: 'mdxJsxAttributeValueExpression', value: lexicalNode.getHeight().toString() },
        });
      }

      if (lexicalNode.getWidth() !== 'inherit') {
        attrs.push({
          type: 'mdxJsxAttribute',
          name: 'width',
          value: { type: 'mdxJsxAttributeValueExpression', value: lexicalNode.getWidth().toString() },
        });
      }

      if (lexicalNode.getAltText()) {
        attrs.push({ type: 'mdxJsxAttribute', name: 'alt', value: lexicalNode.getAltText() });
      }

      if (lexicalNode.getTitle()) {
        attrs.push({ type: 'mdxJsxAttribute', name: 'title', value: lexicalNode.getTitle() });
      }

      attrs.push({ type: 'mdxJsxAttribute', name: 'src', value: lexicalNode.getSrc().toString() });

      actions.appendToParent(mdastParent, {
        type: 'mdxJsxFlowElement',
        name: 'Image',
        attributes: attrs,
        children: [],
      });
    } else {
      actions.appendToParent(mdastParent, {
        type: 'image',
        url: lexicalNode.getSrc(),
        alt: lexicalNode.getAltText(),
        title: lexicalNode.getTitle(),
      });
    }
  },
};
