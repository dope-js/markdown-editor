import { isUndefined, throttle } from 'lodash-es';
import type { RefObject, SyntheticEvent, WheelEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ICanDrag, ISize } from '../types';

const defaultDOMRect = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0,
  toJSON: () => ({}),
};

interface UseImageSizeArgs {
  container: RefObject<HTMLDivElement>;
  image: RefObject<HTMLImageElement>;
  isVertical: boolean;
  zoom: number;
  onZoom?: (zoom: number) => void;
  zoomStep: number;
  maxZoom: number;
  minZoom: number;
}

export function useImageSize({
  container,
  image,
  isVertical,
  zoom,
  onZoom,
  zoomStep,
  maxZoom,
  minZoom,
}: UseImageSizeArgs) {
  const [originSize, setOriginSize] = useState<ISize>({ width: 0, height: 0 });
  const [size, setSize] = useState<ISize>({ width: 0, height: 0 });
  const [loading, setLoading] = useState(true);
  const [currZoom, setCurrZoom] = useState(1);

  const containerReact: DOMRect = useMemo(() => {
    if (container.current) {
      return container.current.getBoundingClientRect();
    }

    return defaultDOMRect;
  }, [container.current]);

  const imageRect: DOMRect = useMemo(() => {
    if (image.current) {
      return image.current.getBoundingClientRect();
    }

    return defaultDOMRect;
  }, [image.current]);

  const canDrag: ICanDrag = useMemo(() => {
    const { width: containerWidth, height: containerHeight } = containerReact;
    let canDragHorizontal = size.width > containerWidth;
    let canDragVertical = size.height > containerHeight;

    if (isVertical) {
      canDragHorizontal = size.height > containerWidth;
      canDragVertical = size.width > containerHeight;
    }

    return { horizontal: canDragHorizontal, vertical: canDragVertical };
  }, [size, isVertical, containerReact]);

  useEffect(() => {
    const newWidth = Math.floor(originSize.width * zoom);
    const newHeight = Math.floor(originSize.height * zoom);

    setSize({ width: newWidth, height: newHeight });
  }, [zoom, originSize, setSize]);

  const handleLoad = useCallback(
    (e: SyntheticEvent<HTMLImageElement>) => {
      if (e.target) {
        const { width: w, height: h } = e.target as HTMLImageElement;
        setOriginSize({ width: w, height: h });

        const imgWidth = !isVertical ? w : h;
        const imgHeight = !isVertical ? h : w;

        if (container.current) {
          const { width: containerWidth, height: containerHeight } = containerReact;
          const reservedWidth = containerWidth - 120;
          const reservedHeight = containerHeight - 120;
          const _zoom = Number(Math.min(reservedWidth / imgWidth, reservedHeight / imgHeight).toFixed(2));
          setCurrZoom(_zoom);
          onZoom?.(_zoom);
        }

        setLoading(false);
      }
    },
    [setOriginSize, onZoom, container.current, isVertical, containerReact]
  );

  const onWheel = useCallback(
    throttle((e: WheelEvent<HTMLImageElement>) => {
      let _zoom: number = currZoom;

      if (e.deltaY < 0) {
        /* zoom in */
        if (currZoom + zoomStep <= maxZoom) {
          _zoom = Number((currZoom + zoomStep).toFixed(2));
        }
      } else if (e.deltaY > 0) {
        /* zoom out */
        if (currZoom - zoomStep >= minZoom) {
          _zoom = Number((currZoom - zoomStep).toFixed(2));
        }
      }

      if (!isUndefined(_zoom)) {
        setCurrZoom(_zoom);
        onZoom?.(_zoom);
      }
    }, 50),
    [onZoom, currZoom, zoomStep, maxZoom, minZoom]
  );

  const handleWheel = useCallback(
    (e: WheelEvent<HTMLImageElement>) => {
      // e.preventDefault();
      e.stopPropagation();

      onWheel(e);
    },
    [onWheel]
  );

  return {
    loading,
    originSize,
    size,
    canDrag,
    containerReact,
    imageRect,
    handleLoad,
    handleWheel,
  };
}
