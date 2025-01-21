import clsx from 'clsx';
import Prism from 'prismjs';
import { useEffect, useRef, type FC } from 'react';

import 'prismjs/plugins/line-numbers/prism-line-numbers.min.js';

export interface ICodeBlockProps {
  lang?: string;
  code?: string;
}

export const CodeBlock: FC<ICodeBlockProps> = ({ code, lang }) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      let className = ref.current.className;
      const languageClassName = `language-${lang}`;

      if (!className.includes(languageClassName)) {
        className = clsx(className, languageClassName);
      }

      ref.current.className = className;
      Prism.highlightElement(ref.current, false);
    }
  }, [code, ref.current, lang]);

  return (
    <div className="dmv-code-block">
      <pre>
        <code ref={ref}>{code}</code>
      </pre>
    </div>
  );
};
