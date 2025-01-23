/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { clsx } from 'clsx';
import type { LexicalEditor } from 'lexical';
import type { FC, PointerEvent as ReactPointerEvent } from 'react';
import { useMemo, useRef } from 'react';

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const Direction = {
  east: 1 << 0,
  north: 1 << 3,
  south: 1 << 1,
  west: 1 << 2,
};

interface ImageResizerProps {
  editor: LexicalEditor;
  imageRef: { current: null | HTMLElement };
  maxWidth?: number;
  onResizeEnd: (width: 'inherit' | number, height: 'inherit' | number) => void;
  onResizeStart: () => void;
}

interface IPositioningRef {
  currentHeight: 'inherit' | number;
  currentWidth: 'inherit' | number;
  direction: number;
  isResizing: boolean;
  ratio: number;
  startHeight: number;
  startWidth: number;
  startX: number;
  startY: number;
  maxWidth: number;
  maxHeight: number;
  minWidth: number;
  minHeight: number;
}

export const ImageResizer: FC<ImageResizerProps> = ({
  onResizeStart,
  onResizeEnd,
  imageRef,
  maxWidth,
  editor,
}: ImageResizerProps) => {
  const controlWrapperRef = useRef<HTMLDivElement>(null);

  const userSelect = useRef({
    priority: '',
    value: 'default',
  });

  const editorRootElement = editor.getRootElement();

  const positioningRef = useRef<IPositioningRef>({
    currentHeight: 0,
    currentWidth: 0,
    direction: 0,
    isResizing: false,
    ratio: 0,
    startHeight: 0,
    startWidth: 0,
    startX: 0,
    startY: 0,
    maxWidth: maxWidth
      ? maxWidth
      : editorRootElement !== null
        ? editorRootElement.getBoundingClientRect().width - 100
        : 100,
    maxHeight: 0,
    minWidth: 100,
    minHeight: 100,
  });

  const setStartCursor = (direction: number) => {
    const ew = direction === Direction.east || direction === Direction.west;
    const ns = direction === Direction.north || direction === Direction.south;
    const nwse =
      (direction & Direction.north && direction & Direction.west) ||
      (direction & Direction.south && direction & Direction.east);

    const cursorDir = ew ? 'ew' : ns ? 'ns' : nwse ? 'nwse' : 'nesw';

    if (editorRootElement !== null) {
      editorRootElement.style.setProperty('cursor', `${cursorDir}-resize`, 'important');
    }

    if (document.body !== null) {
      document.body.style.setProperty('cursor', `${cursorDir}-resize`, 'important');
      userSelect.current.value = document.body.style.getPropertyValue('-webkit-user-select');
      userSelect.current.priority = document.body.style.getPropertyPriority('-webkit-user-select');
      document.body.style.setProperty('-webkit-user-select', `none`, 'important');
    }
  };

  const setEndCursor = () => {
    if (editorRootElement !== null) {
      editorRootElement.style.setProperty('cursor', 'text');
    }

    if (document.body !== null) {
      document.body.style.setProperty('cursor', 'default');
      document.body.style.setProperty('-webkit-user-select', userSelect.current.value, userSelect.current.priority);
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>, direction: number) => {
    if (!editor.isEditable()) {
      return;
    }

    const image = imageRef.current;
    const controlWrapper = controlWrapperRef.current;

    if (image !== null && controlWrapper !== null) {
      event.preventDefault();
      const { width, height } = image.getBoundingClientRect();
      const positioning = positioningRef.current;
      const radio = width / height;

      positioning.startWidth = width;
      positioning.startHeight = height;
      positioning.ratio = radio;
      positioning.currentWidth = width;
      positioning.currentHeight = height;
      positioning.startX = event.clientX;
      positioning.startY = event.clientY;
      positioning.isResizing = true;
      positioning.direction = direction;

      positioning.maxHeight = Math.round(positioning.maxWidth / radio);

      if (width > height) {
        positioning.minWidth = Math.round(positioning.minHeight * radio);
      } else {
        positioning.minHeight = Math.round(positioning.minWidth / radio);
      }

      setStartCursor(direction);
      onResizeStart();

      controlWrapper.classList.add('dme-image-control-wrapper-resizing');
      image.style.height = `${height}px`;
      image.style.width = `${width}px`;

      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    }
  };

  const handlePointerMove = (event: PointerEvent) => {
    const image = imageRef.current;
    const positioning = positioningRef.current;

    const isHorizontal = positioning.direction & (Direction.east | Direction.west);
    const isVertical = positioning.direction & (Direction.south | Direction.north);

    if (image !== null && positioning.isResizing) {
      // Corner cursor
      if (isHorizontal && isVertical) {
        let diff = Math.floor(positioning.startX - event.clientX);
        diff = positioning.direction & Direction.east ? -diff : diff;

        const width = clamp(positioning.startWidth + diff, positioning.minWidth, positioning.maxWidth);
        const height = width / positioning.ratio;
        image.style.width = `${width}px`;
        image.style.height = `${height}px`;
        positioning.currentHeight = height;
        positioning.currentWidth = width;
      } else if (isVertical) {
        let diff = Math.floor(positioning.startY - event.clientY);
        diff = positioning.direction & Direction.south ? -diff : diff;

        const height = clamp(positioning.startHeight + diff, positioning.minHeight, positioning.maxHeight);
        const width = height * positioning.ratio;
        image.style.width = `${width}px`;
        image.style.height = `${height}px`;
        positioning.currentHeight = height;
        positioning.currentWidth = width;
      } else {
        let diff = Math.floor(positioning.startX - event.clientX);
        diff = positioning.direction & Direction.east ? -diff : diff;

        const width = clamp(positioning.startWidth + diff, positioning.minWidth, positioning.maxWidth);
        const height = width / positioning.ratio;
        image.style.width = `${width}px`;
        image.style.height = `${height}px`;
        positioning.currentHeight = height;
        positioning.currentWidth = width;
      }
    }
  };

  const handlePointerUp = () => {
    const image = imageRef.current;
    const positioning = positioningRef.current;
    const controlWrapper = controlWrapperRef.current;
    if (image !== null && controlWrapper !== null && positioning.isResizing) {
      const width = positioning.currentWidth;
      const height = positioning.currentHeight;
      positioning.startWidth = 0;
      positioning.startHeight = 0;
      positioning.ratio = 0;
      positioning.startX = 0;
      positioning.startY = 0;
      positioning.currentWidth = 0;
      positioning.currentHeight = 0;
      positioning.isResizing = false;

      controlWrapper.classList.remove('dme-image-control-wrapper-resizing');

      setEndCursor();
      const newWidth = typeof width === 'number' ? Math.round(width) : width;
      const newHeight = typeof height === 'number' ? Math.round(height) : height;
      onResizeEnd(newWidth, newHeight);

      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    }
  };

  const canZoomIn = useMemo(() => {
    if (!imageRef.current) return true;
    const { width } = imageRef.current.getBoundingClientRect();
    return Math.floor(width) < Math.floor(positioningRef.current.maxWidth);
  }, [imageRef.current, positioningRef.current.currentWidth, positioningRef.current.maxWidth]);

  const canZoomOut = useMemo(() => {
    if (!imageRef.current) return true;
    const { width } = imageRef.current.getBoundingClientRect();
    return Math.floor(width) > Math.floor(positioningRef.current.minWidth);
  }, [imageRef.current, positioningRef.current.currentWidth, positioningRef.current.minWidth]);

  const wrapperClassName = useMemo(() => {
    if (!canZoomIn && !canZoomOut) return 'none';
    if (canZoomIn && canZoomOut) return 'all';
    if (canZoomIn) return 'can-zoomin';
    return 'can-zoomout';
  }, [canZoomIn, canZoomOut]);

  return (
    <div ref={controlWrapperRef} className={clsx('dme-image-resizer-wrapper', wrapperClassName)}>
      <div
        className={clsx('dme-image-resizer', 'dme-image-resizer-n')}
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.north);
        }}
      />
      <div
        className={clsx('dme-image-resizer', 'dme-image-resizer-ne')}
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.north | Direction.east);
        }}
      />
      <div
        className={clsx('dme-image-resizer', 'dme-image-resizer-e')}
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.east);
        }}
      />
      <div
        className={clsx('dme-image-resizer', 'dme-image-resizer-se')}
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.south | Direction.east);
        }}
      />
      <div
        className={clsx('dme-image-resizer', 'dme-image-resizer-s')}
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.south);
        }}
      />
      <div
        className={clsx('dme-image-resizer', 'dme-image-resizer-sw')}
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.south | Direction.west);
        }}
      />
      <div
        className={clsx('dme-image-resizer', 'dme-image-resizer-w')}
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.west);
        }}
      />
      <div
        className={clsx('dme-image-resizer', 'dme-image-resizer-nw')}
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.north | Direction.west);
        }}
      />
    </div>
  );
};
