import type { MdastImportVisitor } from '@/utils';
import type { RootNode } from 'lexical';
import { $createParagraphNode } from 'lexical';
import type * as Mdast from 'mdast';
import type { MdxJsxTextElement, MdxJsxFlowElement, MdxJsxAttributeValueExpression } from 'mdast-util-mdx';
import { $createImageNode } from './node';

export const MdastImageVisitor: MdastImportVisitor<Mdast.Image> = {
  testNode: 'image',
  visitNode({ mdastNode, actions }) {
    actions.addAndStepInto(
      $createImageNode({
        src: mdastNode.url,
        altText: mdastNode.alt ?? '',
        title: mdastNode.title ?? '',
      })
    );
  },
};

export const MdastHtmlImageVisitor: MdastImportVisitor<Mdast.Html> = {
  testNode: (node) => {
    return node.type === 'html' && node.value.trim().startsWith('<img');
  },
  visitNode({ mdastNode, lexicalParent }) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = mdastNode.value;
    const img = wrapper.querySelector('img');

    if (!img) {
      throw new Error('Invalid HTML image');
    }

    const src = img.src;
    const altText = img.alt;
    const title = img.title;
    const width = img.width;
    const height = img.height;

    const image = $createImageNode({
      src: src || '',
      altText,
      title,
      width,
      height,
    });

    if (lexicalParent.getType() === 'root') {
      const paragraph = $createParagraphNode();
      paragraph.append(image);
      (lexicalParent as RootNode).append(paragraph);
    } else {
      (lexicalParent as RootNode).append(image);
    }
  },
};

function getAttributeValue(node: MdxJsxTextElement | MdxJsxFlowElement, attributeName: string) {
  const attribute = node.attributes.find((a) => a.type === 'mdxJsxAttribute' && a.name === attributeName);
  if (!attribute) {
    return undefined;
  }
  return attribute.value as string | undefined;
}

export const MdastJsxImageVisitor: MdastImportVisitor<MdxJsxTextElement | MdxJsxFlowElement> = {
  testNode: (node) => {
    return (node.type === 'mdxJsxTextElement' || node.type === 'mdxJsxFlowElement') && node.name === 'Image';
  },
  visitNode({ mdastNode, actions }) {
    const src = getAttributeValue(mdastNode, 'src');
    if (!src) {
      return;
    }

    const altText = getAttributeValue(mdastNode, 'alt') ?? '';
    const title = getAttributeValue(mdastNode, 'title');
    const heightValue = getAttributeValue(mdastNode, 'height');
    const widthValue = getAttributeValue(mdastNode, 'width');
    let width: number | undefined = undefined;
    let height: number | undefined = undefined;

    if (widthValue) {
      if (typeof widthValue === 'string') {
        width = parseInt(widthValue, 10) ?? undefined;
      } else if (typeof widthValue === 'number') {
        width = widthValue;
      } else if (
        typeof widthValue === 'object' &&
        (widthValue as MdxJsxAttributeValueExpression).type === 'mdxJsxAttributeValueExpression'
      ) {
        width = parseInt((widthValue as MdxJsxAttributeValueExpression).value, 10) ?? undefined;
      }
    }

    if (heightValue) {
      if (typeof heightValue === 'string') {
        height = parseInt(heightValue, 10) ?? undefined;
      } else if (typeof heightValue === 'number') {
        height = heightValue;
      } else if (
        typeof heightValue === 'object' &&
        (heightValue as MdxJsxAttributeValueExpression).type === 'mdxJsxAttributeValueExpression'
      ) {
        height = parseInt((heightValue as MdxJsxAttributeValueExpression).value, 10) ?? undefined;
      }
    }

    console.log(height, width);

    const rest = mdastNode.attributes.filter((a) => {
      return a.type === 'mdxJsxAttribute' && !['src', 'alt', 'title', 'height', 'width'].includes(a.name);
    });

    const image = $createImageNode({
      src,
      altText,
      title,
      width,
      height,
      rest,
    });

    actions.addAndStepInto(image);
  },
};
