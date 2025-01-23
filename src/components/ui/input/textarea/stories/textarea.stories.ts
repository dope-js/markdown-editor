import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '../textarea';

const meta = {
  title: 'UI/TextArea',
  component: Textarea,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
    controls: { exclude: ['forwardRef', 'getValueLength', 'autoFocus', /^on[A-Z].*/g] },
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    autosize: { control: 'boolean' },
  },
  args: {
    value: 'test',
    placeholder: 'Enter text...',
    rows: 3,
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Autosize: Story = {
  args: {
    value: 'test',
    autosize: true,
  },
};
