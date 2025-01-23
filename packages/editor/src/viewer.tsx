import { evaluateSync } from '@mdx-js/mdx';
import clsx from 'clsx';
import type { FC } from 'react';
import { useEffect, useMemo } from 'react';
import * as runtime from 'react/jsx-runtime';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { components } from './viewer/components';
import { codeBlock, lazyloadPlugin } from './viewer/plugins';

import './styles/viewer.scss';

export interface IMDXViewerProps {
  markdown: string;
  className?: string;
  dark?: boolean;
}

export const MDXViewer: FC<IMDXViewerProps> = ({ markdown, className, dark = false }) => {
  useEffect(() => {
    if (dark) {
      document.body.setAttribute('dme-theme', 'dark');
    } else {
      if (document.body.hasAttribute('dme-theme')) {
        document.body.removeAttribute('dme-theme');
      }
    }
  }, [dark]);

  const MDXContentComponent = useMemo(() => {
    // @ts-expect-error TODO: fix this
    const result = evaluateSync(markdown, {
      remarkPlugins: [remarkGfm, remarkMath, codeBlock],
      rehypePlugins: [rehypeKatex, lazyloadPlugin],
      ...runtime,
    }).default;

    return result;
  }, [markdown]);

  if (!MDXContentComponent) return null;

  return (
    <div className={clsx('dme-body', 'dme-viewer-wrapper', className)}>
      <MDXContentComponent components={components} />
    </div>
  );
};
