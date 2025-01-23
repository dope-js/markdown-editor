import { Format } from '@/constants';
import type { MdastImportVisitor } from '@/utils';
import { $createTextNode } from 'lexical';
import type * as Mdast from 'mdast';

interface OpeningHTMLCodeNode extends Mdast.HTML {
  type: 'html';
  value: '<code>';
}

interface ClosingHTMLCodeNode extends Mdast.HTML {
  type: 'html';
  value: '</code>';
}

function isOpeningCodeNode(node: Mdast.Nodes): node is OpeningHTMLCodeNode {
  return node.type === 'html' && node.value === '<code>';
}

function isClosingCodeNode(node: Mdast.Nodes): node is ClosingHTMLCodeNode {
  return node.type === 'html' && node.value === '</code>';
}

export const MdastInlineCodeVisitor: MdastImportVisitor<Mdast.InlineCode> = {
  testNode: (node) => {
    return node.type === 'inlineCode' || isOpeningCodeNode(node) || isClosingCodeNode(node);
  },
  visitNode({ mdastNode, actions, mdastParent }) {
    if (isOpeningCodeNode(mdastNode)) {
      actions.addFormatting(Format.Code, mdastParent);
      return;
    }
    if (isClosingCodeNode(mdastNode)) {
      actions.removeFormatting(Format.Code, mdastParent);
      return;
    }
    actions.addAndStepInto($createTextNode(mdastNode.value).setFormat(Format.Code));
  },
};
