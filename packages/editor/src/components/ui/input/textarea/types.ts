import type {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  MutableRefObject,
  TextareaHTMLAttributes,
} from 'react';

export type AutosizeRow = {
  minRows?: number;
  maxRows?: number;
};

type OmitTextareaAttr =
  | 'onChange'
  | 'onInput'
  | 'prefix'
  | 'size'
  | 'onFocus'
  | 'onBlur'
  | 'onKeyDown'
  | 'onKeyPress'
  | 'onKeyUp'
  | 'onResize'
  | 'readOnly';

export interface ITextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, OmitTextareaAttr> {
  autosize?: boolean | AutosizeRow;
  borderless?: boolean;
  placeholder?: string;
  value?: string;
  rows?: number;
  cols?: number;
  maxCount?: number;
  defaultValue?: string;
  disabled?: boolean;
  readonly?: boolean;
  autoFocus?: boolean;
  showCounter?: boolean;
  showClear?: boolean;
  onClear?: (e: MouseEvent<HTMLTextAreaElement>) => void;
  onChange?: (value: string, e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  onInput?: (e: MouseEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onKeyUp?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onKeyPress?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onEnterPress?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onPressEnter?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onResize?: (data: { height: number }) => void;
  getValueLength?: (value: string) => number;
  forwardRef?: ((instance: HTMLTextAreaElement) => void) | MutableRefObject<HTMLTextAreaElement> | null;
}
