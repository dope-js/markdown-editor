import { EditorButton, IconMinus } from '@/components';
import { useEditor } from '@/contexts';
import { usePublisher } from '@mdxeditor/gurx';
import type { FC } from 'react';
import { insertThematicBreak$ } from '../../thematic-break';

export const InsertThematicBreak: FC = () => {
  const insertThematicBreak = usePublisher(insertThematicBreak$);
  const { t } = useEditor();

  return <EditorButton icon={<IconMinus />} title={t('toolbar.thematicBreak')} onClick={() => insertThematicBreak()} />;
};
