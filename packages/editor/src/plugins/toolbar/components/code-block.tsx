import { EditorButton, IconCodeBlock } from '@/components';
import { useEditor } from '@/contexts';
import { usePublisher } from '@mdxeditor/gurx';
import type { FC } from 'react';
import { insertCodeBlock$ } from '../../codeblock';

export const InsertCodeBlock: FC = () => {
  const insertCodeBlock = usePublisher(insertCodeBlock$);
  const { t } = useEditor();

  return (
    <EditorButton
      icon={<IconCodeBlock />}
      title={t('toolbar.codeblock.insert')}
      onClick={() => insertCodeBlock({ language: 'txt', code: '' })}
    />
  );
};
