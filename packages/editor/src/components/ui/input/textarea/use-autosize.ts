import { isObject } from '@/utils';
import type { RefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { AutosizeRow } from './types';
import { calculateNodeHeight, getSizingData } from './utils';

export function useAutoSize(
  value: string,
  placeholder: string | undefined,
  rows: number,
  ref: RefObject<HTMLTextAreaElement>,
  autosize?: boolean | AutosizeRow
) {
  const [height, setHeight] = useState(0);
  const resizeLock = useRef(false);

  const resizeTextArea = useCallback(() => {
    if (!ref.current) return;
    const nodeSizingData = getSizingData(ref.current);

    if (!nodeSizingData) {
      resizeLock.current = false;
      return;
    }

    const [minRows, maxRows] = isObject(autosize) ? [autosize.minRows ?? rows, autosize.maxRows] : [rows];

    const newHeight = calculateNodeHeight(
      nodeSizingData,
      ref.current.value || ref.current.placeholder || 'x',
      minRows,
      maxRows
    );

    if (height !== newHeight) {
      setHeight(newHeight);
      ref.current.style.height = `${newHeight}px`;
      return;
    }

    resizeLock.current = false;
  }, [height, rows, autosize, ref.current, resizeLock.current]);

  const resizeListener = useCallback(() => {
    if (resizeLock.current) return;

    resizeLock.current = true;
    resizeTextArea();
  }, [resizeLock.current, resizeTextArea]);

  useEffect(() => {
    if (autosize) {
      window.addEventListener('resize', resizeListener);
    }

    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, [autosize, resizeListener]);

  useEffect(() => {
    resizeTextArea();
  }, [value, placeholder, autosize, resizeTextArea]);
}
