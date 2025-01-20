import { EditorButton, IconDelete } from '@/components';
import { useEditor } from '@/contexts';
import { Popover } from '@douyinfe/semi-ui';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import { clsx } from 'clsx';
import type { BaseSelection, LexicalEditor } from 'lexical';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import type { MdxJsxAttribute, MdxJsxExpressionAttribute } from 'mdast-util-mdx-jsx';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LazyImage } from './lazy-image';
import { $isImageNode } from '../node';
import { ImageResizer } from './resizer';

import './image.scss';

export interface ImageEditorProps {
  nodeKey: string;
  src: string;
  alt?: string;
  title?: string;
  width: number | 'inherit';
  height: number | 'inherit';
  rest: (MdxJsxAttribute | MdxJsxExpressionAttribute)[];
}

export function ImageEditor({ src, title, alt, nodeKey, width, height, rest }: ImageEditorProps): JSX.Element | null {
  const imageRef = useRef<null | HTMLImageElement>(null);
  const wrapperRef = useRef<null | HTMLDivElement>(null);
  const [isSelected, setSelected, clearSelected] = useLexicalNodeSelection(nodeKey);
  const [editor] = useLexicalComposerContext();
  const [, setSelection] = useState<BaseSelection | null>(null);
  const activeEditorRef = useRef<LexicalEditor | null>(null);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [imageSource, setImageSource] = useState<string | null>(null);
  const { t } = useEditor();

  const isInWrapper = useCallback(
    (target: HTMLElement | null) => {
      if (!target) return;
      if (target === wrapperRef.current) return true;

      if (isInWrapper(target.parentElement)) return true;
      return false;
    },
    [wrapperRef.current]
  );

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if ($isImageNode(node)) {
          node.remove();
        }
      }
      return false;
    },
    [isSelected, nodeKey]
  );

  useEffect(() => {
    setImageSource(src);
  }, [src]);

  useEffect(() => {
    let isMounted = true;

    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        if (isMounted) setSelection(editorState.read(() => $getSelection()));
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor;
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload;

          if (isResizing) {
            return true;
          }

          if (event.target instanceof HTMLElement && isInWrapper(event.target)) {
            if (event.shiftKey) {
              setSelected(!isSelected);
            } else {
              clearSelected();
              setSelected(true);
            }
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(KEY_DELETE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW)
    );

    return () => {
      isMounted = false;
      unregister();
    };
  }, [clearSelected, editor, isResizing, isSelected, nodeKey, onDelete, setSelected]);

  const onResizeEnd = (nextWidth: 'inherit' | number, nextHeight: 'inherit' | number) => {
    // Delay hiding the resize bars for click case
    setTimeout(() => {
      setIsResizing(false);
    }, 200);

    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.setWidthAndHeight(nextWidth, nextHeight);
      }
    });
  };

  const onResizeStart = () => {
    setIsResizing(true);
  };

  const isFocused = isSelected;

  const passedClassName = useMemo(() => {
    if (rest.length === 0) {
      return null;
    }

    const className = rest.find(
      (attr) => attr.type === 'mdxJsxAttribute' && (attr.name === 'class' || attr.name === 'className')
    );

    if (className) {
      return className.value as string;
    }

    return null;
  }, [rest]);

  return imageSource !== null ? (
    <Suspense fallback={null}>
      <Popover
        trigger="custom"
        visible={isFocused}
        position="top"
        showArrow
        content={
          <EditorButton
            icon={<IconDelete />}
            title={t('image.remove')}
            size="small"
            minor
            onClick={(e) => {
              e.preventDefault();
              editor.update(() => {
                $getNodeByKey(nodeKey)?.remove();
              });
            }}
          />
        }
      >
        <div className="dme-image-wrapper" ref={wrapperRef} data-editor-block-type="image">
          <div className={clsx('dme-image', { 'dme-image-focused': isFocused })}>
            <LazyImage
              width={width}
              height={height}
              className={passedClassName}
              src={imageSource}
              title={title ?? ''}
              alt={alt ?? ''}
              imageRef={imageRef}
            />
          </div>
          {isFocused && (
            <ImageResizer editor={editor} imageRef={imageRef} onResizeStart={onResizeStart} onResizeEnd={onResizeEnd} />
          )}
        </div>
      </Popover>
    </Suspense>
  ) : null;
}
