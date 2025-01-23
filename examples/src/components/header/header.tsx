import { FC, useState } from 'react';
import styles from './header.module.scss';
import { useTheme } from '../../contexts/theme';
import { SwitchButtons } from '../switch-buttons/switch';
import { IconMoon } from '../icons/moon';
import { IconSun } from '../icons/sun';
import { IconLanguage } from '../icons/language';
import clsx from 'clsx';
import {
  flip,
  FloatingPortal,
  offset,
  safePolygon,
  shift,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
} from '@floating-ui/react';
import { IconTick } from '../icons/tick';

interface IHeaderProps {
  locale: 'zh-CN' | 'en-US';
  setLocale: (locale: 'zh-CN' | 'en-US') => void;
}

export const Header: FC<IHeaderProps> = ({ locale, setLocale }) => {
  const { dark, switchDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-end',
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(6), flip(), shift({ padding: 12 })],
  });

  const hover = useHover(context, { move: true, handleClose: safePolygon() });
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, dismiss]);

  return (
    <div className={styles.wrapper}>
      <span className={styles.brand}>DopeJs Markdown Editor</span>
      <div className={styles.menu}>
        <SwitchButtons
          options={[
            { icon: <IconSun />, value: false },
            { icon: <IconMoon />, value: true },
          ]}
          value={dark}
          onChange={switchDark}
        />
        <span
          ref={refs.setReference}
          {...getReferenceProps({ className: clsx(styles.icon, { [styles['icon-selected']]: isOpen }) })}
        >
          <IconLanguage />
        </span>
        {isOpen && (
          <FloatingPortal root={document.body}>
            <div
              ref={refs.setFloating}
              {...getFloatingProps({ className: clsx('dme-body', styles['dropdown-menu']), style: floatingStyles })}
            >
              <div
                className={clsx(styles['dropdown-menu-item'], {
                  [styles['dropdown-menu-item-selected']]: locale === 'en-US',
                })}
                onClick={() => {
                  setLocale('en-US');
                  // setIsOpen(false);
                }}
              >
                <div className={styles['dropdown-menu-item-tick']}>
                  <IconTick />
                </div>
                <span>English</span>
              </div>
              <div
                className={clsx(styles['dropdown-menu-item'], {
                  [styles['dropdown-menu-item-selected']]: locale === 'zh-CN',
                })}
                onClick={() => {
                  setLocale('zh-CN');
                  // setIsOpen(false);
                }}
              >
                <div className={styles['dropdown-menu-item-tick']}>
                  <IconTick />
                </div>
                <span>简体中文</span>
              </div>
            </div>
          </FloatingPortal>
        )}
      </div>
    </div>
  );
};
