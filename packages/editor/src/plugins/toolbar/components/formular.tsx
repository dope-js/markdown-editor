import { EditorButton, FormularModal, IconFormular } from '@/components';
import { useEditor } from '@/contexts';
import { Dropdown } from '@douyinfe/semi-ui';
import { usePublisher } from '@mdxeditor/gurx';
import type { FC } from 'react';
import { useState } from 'react';
import { insertFormular$ } from '../../formular';
import { insertFormularBlock$ } from '../../formular-block';

export const InsertFormular: FC = () => {
  const { t } = useEditor();
  const insertFormular = usePublisher(insertFormular$);
  const insertFormularBlock = usePublisher(insertFormularBlock$);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Dropdown
        position="bottomLeft"
        trigger="click"
        clickToHide
        menu={[
          { node: 'item', name: t('toolbar.formular.inline'), onClick: () => insertFormular({ value: '' }) },
          { node: 'item', name: t('toolbar.formular.block'), onClick: () => setModalVisible(true) },
        ]}
      >
        <div>
          <EditorButton icon={<IconFormular />} title={t('toolbar.formular.title')} />
        </div>
      </Dropdown>
      {modalVisible && (
        <FormularModal
          title={t('formular.insert')}
          math=""
          visible={modalVisible}
          setVisible={setModalVisible}
          setMath={(math) => {
            insertFormularBlock({ value: math });
            setModalVisible(false);
          }}
        />
      )}
    </>
  );
};
