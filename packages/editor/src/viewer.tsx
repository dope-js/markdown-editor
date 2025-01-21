import { evaluateSync } from '@mdx-js/mdx';
import clsx from 'clsx';
import type { FC } from 'react';
import { useMemo } from 'react';
import * as runtime from 'react/jsx-runtime';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { components } from './viewer/components';
import { codeBlock, lazyloadPlugin } from './viewer/plugins';

import './styles/viewer.scss';

interface IMDXViewer {
  markdown: string;
  className?: string;
  dark?: boolean;
}

export const MDXViewer: FC<IMDXViewer> = ({ markdown, className, dark = false }) => {
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
    <div className={clsx('dmv-wrapper', { 'dme-dark': dark }, className)}>
      <MDXContentComponent components={components} />
    </div>
  );
};
