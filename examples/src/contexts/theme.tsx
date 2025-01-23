import { type FC, type PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from 'react';

const storedThemeKey = 'dopejs-theme';

interface IThemeContext {
  dark: boolean;
  switchDark: () => void;
}

const ThemeContext = createContext<IThemeContext | null>(null);

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [dark, setDark] = useState(false);

  const darkTurnOff = useCallback(() => {
    if (document.body.hasAttribute('dme-theme')) {
      document.body.removeAttribute('dme-theme');
    }

    localStorage.setItem(storedThemeKey, 'light');
    setDark(false);
  }, []);

  const darkTurnOn = useCallback(() => {
    document.body.setAttribute('dme-theme', 'dark');
    localStorage.setItem(storedThemeKey, 'dark');
    setDark(true);
  }, []);

  useEffect(() => {
    const theme = localStorage.getItem(storedThemeKey);
    if (theme && ['light', 'dark'].includes(theme!)) {
      if (theme === 'dark') {
        darkTurnOn();
      } else {
        darkTurnOff();
      }
      return;
    }

    const mql = window.matchMedia('(prefers-color-scheme: dark)');

    function matchMode(e: MediaQueryListEvent) {
      if (e.matches) {
        darkTurnOn();
      } else {
        darkTurnOff();
      }
    }

    mql.addEventListener('change', matchMode);

    return () => {
      mql.removeEventListener('change', matchMode);
    };
  }, [darkTurnOn, darkTurnOff]);

  const switchDark = useCallback(() => {
    if (dark) {
      darkTurnOff();
    } else {
      darkTurnOn();
    }
  }, [dark, darkTurnOff, darkTurnOn]);

  return <ThemeContext.Provider value={{ dark, switchDark }}>{children}</ThemeContext.Provider>;
};

export function useTheme(): IThemeContext {
  const ctx = useContext(ThemeContext)!;
  return ctx;
}
