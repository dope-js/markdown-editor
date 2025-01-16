import { defineEditorPlugin } from '@/utils';
import { $wrapNodeInElement } from '@lexical/utils';
import { Signal, withLatestFrom } from '@mdxeditor/gurx';
import type { LexicalCommand } from 'lexical';
import { $createParagraphNode, $insertNodes, $isRootOrShadowRoot, createCommand } from 'lexical';
import { activeEditor$, addExportVisitor$, addImportVisitor$, addLexicalNode$ } from '../core';
import { LexicalImageVisitor } from './LexicalImageVisitor';
import { MdastHtmlImageVisitor, MdastImageVisitor, MdastJsxImageVisitor } from './MdastImageVisitor';
import type { CreateImageNodeParameters } from './node';
import { $createImageNode, ImageNode } from './node';

export * from './node';

/**
 * @group Image
 */
export type ImagePreviewHandler = ((imageSource: string) => Promise<string>) | null;

/**
 * @group Image
 */
export interface InsertImageParameters {
  src: string;
  altText?: string;
  title?: string;
  width?: number;
  height?: number;
}

export const insertImage$ = Signal<InsertImageParameters>((r) => {
  r.sub(r.pipe(insertImage$, withLatestFrom(activeEditor$)), ([values, theEditor]) => {
    theEditor?.update(() => {
      const imageNode = $createImageNode(values);
      $insertNodes([imageNode]);
      if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
        $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
      }
    });
  });
});

/**
 * A plugin that adds support for images.
 * @group Image
 */
export const imagePlugin = defineEditorPlugin<{}>({
  init(realm) {
    realm.pubIn({
      [addImportVisitor$]: [MdastImageVisitor, MdastHtmlImageVisitor, MdastJsxImageVisitor],
      [addLexicalNode$]: ImageNode,
      [addExportVisitor$]: LexicalImageVisitor,
    });
  },
});

/** @internal */
export type InsertImagePayload = Readonly<CreateImageNodeParameters>;

/**
 * @internal
 */
export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> = createCommand('INSERT_IMAGE_COMMAND');
