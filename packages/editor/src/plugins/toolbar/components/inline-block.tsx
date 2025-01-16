import { EditorButton, IconCode } from '@/components';
import { Format } from '@/constants';
import { useEditor } from '@/contexts';
import { useCellValues, usePublisher } from '@mdxeditor/gurx';
import type { FC } from 'react';
import { applyFormat$, currentFormat$ } from '../../core';

/**
 * A toolbar component that lets the user toggle code formatting.
 * Use for inline `code` elements (like variables, methods, etc).
 * @group Toolbar Components
 */
export const CodeToggle: FC = () => {
  const [currentFormat] = useCellValues(currentFormat$);
  const applyFormat = usePublisher(applyFormat$);
  const { t } = useEditor();

  const codeIsOn = (currentFormat & Format.Code) !== 0;

  return (
    <EditorButton
      active={codeIsOn}
      icon={<IconCode />}
      title={t('toolbar.inlineCode.title')}
      activeTitle={t('toolbar.inlineCode.remove')}
      onClick={() => applyFormat('code')}
    />
  );
};
