import { EditorButton, IconGridSquare } from '@/components';
import { useEditor } from '@/contexts';
import { usePublisher } from '@mdxeditor/gurx';
import type { FC } from 'react';
import { insertTable$ } from '../../table';

export const InsertTable: FC = () => {
  const insertTable = usePublisher(insertTable$);
  const { t } = useEditor();

  return (
    <EditorButton
      icon={<IconGridSquare />}
      title={t('toolbar.table')}
      onClick={() => insertTable({ rows: 3, columns: 3 })}
    />
  );
};
