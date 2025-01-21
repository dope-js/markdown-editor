import { CodeHighlight } from '@douyinfe/semi-ui';
import type { FC } from 'react';

export interface ICodeBlockProps {
  lang?: string;
  code?: string;
}

export const CodeBlock: FC<ICodeBlockProps> = ({ code, lang }) => {
  return <CodeHighlight className="dmv-code-block" language={lang} code={code} />;
};
