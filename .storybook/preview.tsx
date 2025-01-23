/* eslint-disable @typescript-eslint/no-unused-vars */
import { DocsContainer } from '@storybook/addon-docs';
import { addons } from '@storybook/preview-api';
import type { Preview } from '@storybook/react';
import { themes } from '@storybook/theming';
import React from 'react';
import { DARK_MODE_EVENT_NAME, UPDATE_DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';
import { ThemeDecorator } from './themeDecorator';

import 'katex/dist/katex.min.css';
import '../src/styles/editor.scss';
import '../src/styles/viewer.scss';
import './preview.scss';

export const decorators = [ThemeDecorator];

const channel = addons.getChannel();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export const parameters = {
  darkMode: {
    // Override the default dark theme
    dark: { ...themes.dark, appBg: 'black' },
    // Override the default light theme
    light: { ...themes.normal, appBg: 'red' },
    stylePreview: true,
  },

  docs: {
    container: (props) => {
      const [isDark, setDark] = React.useState();

      const onChangeHandler = () => {
        channel.emit(UPDATE_DARK_MODE_EVENT_NAME);
      };

      React.useEffect(() => {
        channel.on(DARK_MODE_EVENT_NAME, setDark);
        return () => channel.removeListener(DARK_MODE_EVENT_NAME, setDark);
      }, [channel, setDark]);

      return (
        <div>
          <input type="checkbox" onChange={onChangeHandler} />
          <DocsContainer {...props} />
        </div>
      );
    },
  },
};

export default preview;
