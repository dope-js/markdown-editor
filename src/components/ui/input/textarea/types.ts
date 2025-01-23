import type { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent, TextareaHTMLAttributes } from 'react';

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
  placeholder?: string;
  value?: string;
  rows?: number;
  autoFocus?: boolean;
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
}
