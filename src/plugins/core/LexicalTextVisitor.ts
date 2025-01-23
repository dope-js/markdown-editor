import { Format } from '@/constants';
import type { LexicalExportVisitor } from '@/utils';
import type { TextNode } from 'lexical';
import { $isTextNode } from 'lexical';
import type * as Mdast from 'mdast';
import type { MdxJsxTextElement } from 'mdast-util-mdx-jsx';

export function isMdastText(mdastNode: Mdast.Nodes): mdastNode is Mdast.Text {
  return mdastNode.type === 'text';
}

const JOINABLE_TAGS = ['u', 'span', 'sub', 'sup'];

export const LexicalTextVisitor: LexicalExportVisitor<TextNode, Mdast.Text | Mdast.Html | MdxJsxTextElement> = {
  shouldJoin: (prevNode, currentNode) => {
    if (['text', 'emphasis', 'strong'].includes(prevNode.type)) {
      return prevNode.type === currentNode.type;
    }

    if (
      prevNode.type === 'mdxJsxTextElement' &&
      currentNode.type === 'mdxJsxTextElement' &&
      JOINABLE_TAGS.includes((currentNode as unknown as MdxJsxTextElement).name!)
    ) {
      const currentMdxNode: MdxJsxTextElement = currentNode as unknown as MdxJsxTextElement;
      return (
        prevNode.name === currentMdxNode.name &&
        JSON.stringify(prevNode.attributes) === JSON.stringify(currentMdxNode.attributes)
      );
    }
    return false;
  },

  join<T extends Mdast.Nodes>(prevNode: T, currentNode: T) {
    if (isMdastText(prevNode) && isMdastText(currentNode)) {
      return {
        type: 'text',
        value: prevNode.value + currentNode.value,
      } as unknown as T;
    } else {
      return {
        ...prevNode,
        children: [
          ...(prevNode as unknown as Mdast.Parent).children,
          ...(currentNode as unknown as Mdast.Parent).children,
        ],
      };
    }
  },

  testLexicalNode: $isTextNode,
  visitLexicalNode: ({ lexicalNode, mdastParent, actions }) => {
    const previousSibling = lexicalNode.getPreviousSibling();
    const prevFormat = $isTextNode(previousSibling) ? previousSibling.getFormat() : 0;
    const textContent = lexicalNode.getTextContent();
    // if the node is only whitespace, ignore the format.
    const format = lexicalNode.getFormat();
    const style = lexicalNode.getStyle();

    let localParentNode = mdastParent;

    if (style) {
      localParentNode = actions.appendToParent(localParentNode, {
        type: 'mdxJsxTextElement',
        name: 'span',
        children: [],
        attributes: [{ type: 'mdxJsxAttribute', name: 'style', value: style }],
      }) as Mdast.Parent;
    }

    if (prevFormat & format & Format.Italic) {
      localParentNode = actions.appendToParent(localParentNode, {
        type: 'emphasis',
        children: [],
      }) as Mdast.Parent;
    }
    if (prevFormat & format & Format.Bold) {
      localParentNode = actions.appendToParent(localParentNode, {
        type: 'strong',
        children: [],
      }) as Mdast.Parent;
    }

    if (prevFormat & format & Format.Underline) {
      localParentNode = actions.appendToParent(localParentNode, {
        type: 'mdxJsxTextElement',
        name: 'u',
        children: [],
        attributes: [],
      }) as Mdast.Parent;
    }

    if (prevFormat & format & Format.Strikethrough) {
      localParentNode = actions.appendToParent(localParentNode, {
        type: 'delete',
        children: [],
      }) as Mdast.Parent;
    }

    if (prevFormat & format & Format.Superscript) {
      localParentNode = actions.appendToParent(localParentNode, {
        type: 'mdxJsxTextElement',
        name: 'sup',
        children: [],
        attributes: [],
      }) as Mdast.Parent;
    }

    if (prevFormat & format & Format.Subscript) {
      localParentNode = actions.appendToParent(localParentNode, {
        type: 'mdxJsxTextElement',
        name: 'sub',
        children: [],
        attributes: [],
      }) as Mdast.Parent;
    }

    // repeat the same sequence as above for formatting introduced with this node
    if (format & Format.Italic && !(prevFormat & Format.Italic)) {
      localParentNode = actions.appendToParent(localParentNode, {
        type: 'emphasis',
        children: [],
      }) as Mdast.Parent;
    }

    if (format & Format.Bold && !(prevFormat & Format.Bold)) {
      localParentNode = actions.appendToParent(localParentNode, {
        type: 'strong',
        children: [],
      }) as Mdast.Parent;
    }

    if (format & Format.Underline && !(prevFormat & Format.Underline)) {
      localParentNode = actions.appendToParent(localParentNode, {
        type: 'mdxJsxTextElement',
        name: 'u',
        children: [],
        attributes: [],
      }) as Mdast.Parent;
    }

    if (format & Format.Strikethrough && !(prevFormat & Format.Strikethrough)) {
      localParentNode = actions.appendToParent(localParentNode, {
        type: 'delete',
        children: [],
      }) as Mdast.Parent;
    }

    if (format & Format.Superscript && !(prevFormat & Format.Superscript)) {
      localParentNode = actions.appendToParent(localParentNode, {
        type: 'mdxJsxTextElement',
        name: 'sup',
        children: [],
        attributes: [],
      }) as Mdast.Parent;
    }

    if (format & Format.Subscript && !(prevFormat & Format.Subscript)) {
      localParentNode = actions.appendToParent(localParentNode, {
        type: 'mdxJsxTextElement',
        name: 'sub',
        children: [],
        attributes: [],
      }) as Mdast.Parent;
    }

    if (format & Format.Code) {
      actions.appendToParent(localParentNode, {
        type: 'inlineCode',
        value: textContent,
      });
      return;
    }

    actions.appendToParent(localParentNode, {
      type: 'text',
      value: textContent,
    });
  },
};
