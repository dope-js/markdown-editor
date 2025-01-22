import { FC } from 'react';
import styles from './header.module.scss';

export const Header: FC = () => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.brand}>DopeJs Markdown Editor</span>
    </div>
  );
};
