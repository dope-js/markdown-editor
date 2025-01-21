import type { MouseEvent, RefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ICanDrag, ISize } from '../types';

export interface ImageOffset {
  x: number;
  y: number;
}

interface UseOffsetArgs {
  size: ISize;
  containerReact: DOMRect;
  imageRect: DOMRect;
  isVertical: boolean;
  canDrag: ICanDrag;
  container: RefObject<HTMLDivElement>;
}

export function useImageOffset({ size, containerReact, imageRect, isVertical, canDrag }: UseOffsetArgs) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const startMouseMove = useRef(false);
  const startMouseOffset = useRef({ x: 0, y: 0 });

  const calcExtremeBounds = useCallback(() => {
    const { width: containerWidth, height: containerHeight } = containerReact;
    let extremeLeft = containerWidth - size.width;
    let extremeTop = containerHeight - size.height;
    if (isVertical) {
      extremeLeft = containerWidth - size.height;
      extremeTop = containerHeight - size.width;
    }
    return {
      left: extremeLeft,
      top: extremeTop,
    };
  }, [size, containerReact, isVertical]);

  const handleMoveImage = useCallback(
    (e: MouseEvent<HTMLImageElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (startMouseMove.current && (canDrag.horizontal || canDrag.vertical)) {
        const { clientX, clientY } = e;
        const { left: containerLeft, top: containerTop } = containerReact;
        const { left: extremeLeft, top: extremeTop } = calcExtremeBounds();
        let newX = canDrag.horizontal ? clientX - containerLeft - startMouseOffset.current.x : offset.x;
        let newY = canDrag.vertical ? clientY - containerTop - startMouseOffset.current.y : offset.y;
        if (canDrag.horizontal) {
          newX = newX > 0 ? 0 : newX < extremeLeft ? extremeLeft : newX;
        }
        if (canDrag.vertical) {
          newY = newY > 0 ? 0 : newY < extremeTop ? extremeTop : newY;
        }
        const _offset = {
          x: newX,
          y: newY,
        };

        setOffset(_offset);
        setLeft(isVertical ? _offset.x - (size.width - size.height) / 2 : _offset.x);
        setTop(isVertical ? _offset.y - (size.width - size.height) / 2 : _offset.y);
      }
    },
    [
      canDrag,
      containerReact,
      isVertical,
      offset,
      setOffset,
      size,
      setLeft,
      setTop,
      startMouseMove.current,
      startMouseOffset.current,
    ]
  );

  useEffect(() => {
    if (!canDrag.horizontal) {
      const { width: containerWidth } = containerReact;
      const { width: imgWidth } = size;
      const newOffsetX = (containerWidth - imgWidth) / 2;
      setOffset((offset) => ({ ...offset, x: newOffsetX }));
      setLeft(isVertical ? newOffsetX - (size.width - size.height) / 2 : newOffsetX);
    }

    if (!canDrag.vertical) {
      const { height: containerHeight } = containerReact;
      const { height: imgHeight } = size;
      const newOffsetY = (containerHeight - imgHeight) / 2;
      setOffset((offset) => ({ ...offset, y: newOffsetY }));
      setTop(isVertical ? newOffsetY - (size.width - size.height) / 2 : newOffsetY);
    }
  }, [canDrag, containerReact, size]);

  const getOffset = (e: MouseEvent<HTMLImageElement>): ImageOffset => {
    const { left, top } = imageRect;
    return {
      x: e.clientX - left,
      y: e.clientY - top,
    };
  };

  const handleMoveStart = useCallback((e: MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    e.stopPropagation();
    startMouseOffset.current = getOffset(e);
    startMouseMove.current = true;
  }, []);

  const handleMoveEnd = useCallback((e: MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('end');

    startMouseMove.current = false;
  }, []);

  return { left, top, handleMoveStart, handleMoveImage, handleMoveEnd, isDragging: startMouseMove.current };
}
