import { Format } from '@/constants';
import type { MdastImportVisitor } from '@/utils';
import { $createTextNode } from 'lexical';
import type * as Mdast from 'mdast';
import type { MdxJsxTextElement } from 'mdast-util-mdx';

function buildFormattingVisitors(tag: string, format: Format): MdastImportVisitor<Mdast.RootContent>[] {
  return [
    {
      testNode: (node) => node.type === 'mdxJsxTextElement' && node.name === tag,
      visitNode({ actions, mdastNode, lexicalParent }) {
        actions.addFormatting(format);
        actions.visitChildren(mdastNode as MdxJsxTextElement, lexicalParent);
      },
    },
    {
      testNode: (node: Mdast.Nodes) => node.type === 'html' && node.value === `<${tag}>`,
      visitNode({ actions, mdastParent }) {
        actions.addFormatting(format, mdastParent);
      },
    },
    {
      testNode: (node: Mdast.Nodes) => node.type === 'html' && node.value === `</${tag}>`,
      visitNode({ actions, mdastParent }) {
        actions.removeFormatting(format, mdastParent);
      },
    },
  ];
}

const StrikeThroughVisitor: MdastImportVisitor<Mdast.Delete> = {
  testNode: 'delete',
  visitNode({ mdastNode, actions, lexicalParent }) {
    actions.addFormatting(Format.Strikethrough);
    actions.visitChildren(mdastNode, lexicalParent);
  },
};

const MdCodeVisitor: MdastImportVisitor<Mdast.InlineCode> = {
  testNode: 'inlineCode',
  visitNode({ mdastNode, actions }) {
    actions.addAndStepInto($createTextNode(mdastNode.value).setFormat(actions.getParentFormatting() | Format.Code));
  },
};

const MdEmphasisVisitor: MdastImportVisitor<Mdast.Emphasis> = {
  testNode: 'emphasis',
  visitNode({ mdastNode, actions, lexicalParent }) {
    actions.addFormatting(Format.Italic);
    actions.visitChildren(mdastNode, lexicalParent);
  },
};

const MdStrongVisitor: MdastImportVisitor<Mdast.Strong> = {
  testNode: 'strong',
  visitNode({ mdastNode, actions, lexicalParent }) {
    actions.addFormatting(Format.Bold);
    actions.visitChildren(mdastNode, lexicalParent);
  },
};

export const formattingVisitors = [
  // emphasis
  MdEmphasisVisitor,

  // strong
  MdStrongVisitor,

  // underline
  ...buildFormattingVisitors('u', Format.Underline),

  // code
  ...buildFormattingVisitors('code', Format.Code),
  MdCodeVisitor,

  // strikethrough
  StrikeThroughVisitor,

  // superscript
  ...buildFormattingVisitors('sup', Format.Superscript),
  // subscript
  ...buildFormattingVisitors('sub', Format.Subscript),
];
