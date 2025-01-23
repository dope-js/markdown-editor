import type { MdastImportVisitor } from '@/utils';
import type { MdxJsxAttribute } from 'mdast-util-mdx';
import { $createGenericHTMLNode } from './GenericHTMLNode';
import type { MdastHTMLNode } from './MdastHTMLNode';
import { isMdastHTMLNode } from './MdastHTMLNode';

export const MdastHTMLVisitor: MdastImportVisitor<MdastHTMLNode> = {
  testNode: isMdastHTMLNode,
  visitNode: function ({ mdastNode, actions }): void {
    actions.addAndStepInto(
      $createGenericHTMLNode(mdastNode.name, mdastNode.type, mdastNode.attributes as MdxJsxAttribute[])
    );
  },
  priority: -100,
};
