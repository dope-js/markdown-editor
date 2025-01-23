/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDarkMode } from 'storybook-dark-mode';

export const ThemeDecorator = (Story: any) => {
  const isDark = useDarkMode();

  useEffect(() => {
    if (isDark) {
      document.body.setAttribute('dme-theme', 'dark');
    } else {
      if (document.body.hasAttribute('dme-theme')) {
        document.body.removeAttribute('dme-theme');
      }
    }
  }, [isDark]);

  return (
    <>
      <div className="dme-body">
        <Story />
      </div>
    </>
  );
};
