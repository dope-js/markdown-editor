import { EditorButton, IconCheckList, IconList, IconOrderedList } from '@/components';
import { useEditor } from '@/contexts';
import { useCellValues, usePublisher } from '@mdxeditor/gurx';
import type { FC } from 'react';
import { applyListType$, currentListType$ } from '../../lists';

export const ListsToggle: FC<{ options?: ('bullet' | 'number' | 'check')[] }> = ({
  options = ['bullet', 'number', 'check'],
}) => {
  const [currentListType] = useCellValues(currentListType$);
  const applyListType = usePublisher(applyListType$);
  const { t } = useEditor();

  const showAllButtons = typeof options === 'undefined';

  return (
    <>
      {showAllButtons || options.includes('bullet') ? (
        <EditorButton
          icon={<IconList />}
          title={t('toolbar.list.bullet')}
          active={currentListType === 'bullet'}
          onClick={() => applyListType('bullet')}
        />
      ) : null}
      {showAllButtons || options.includes('number') ? (
        <EditorButton
          icon={<IconOrderedList />}
          title={t('toolbar.list.number')}
          active={currentListType === 'number'}
          onClick={() => applyListType('number')}
        />
      ) : null}
      {showAllButtons || options.includes('check') ? (
        <EditorButton
          icon={<IconCheckList />}
          title={t('toolbar.list.check')}
          active={currentListType === 'check'}
          onClick={() => applyListType('check')}
        />
      ) : null}
    </>
  );
};
