import type { Preview } from '@storybook/react';

import 'katex/dist/katex.min.css';
import '../src/styles/editor.scss';
import '../src/styles/viewer.scss';

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

export default preview;
