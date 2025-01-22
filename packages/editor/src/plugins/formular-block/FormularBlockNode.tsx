import { voidEmitter } from '@/utils';
import clsx from 'clsx';
import type { EditorConfig, LexicalEditor, LexicalNode, NodeKey, SerializedLexicalNode, Spread } from 'lexical';
import { DecoratorNode } from 'lexical';
import { FormularBlock } from './components';

import './components/formular.scss';

export interface CreateFormularBlockNodeOptions {
  value: string;
}

export type SerializedFormularBlockNode = Spread<
  CreateFormularBlockNodeOptions & { type: 'math'; version: 1 },
  SerializedLexicalNode
>;

export class FormularBlockNode extends DecoratorNode<JSX.Element> {
  __math: string;
  focusEmitter = voidEmitter();

  static getType(): string {
    return 'math';
  }

  static clone(node: FormularBlockNode): FormularBlockNode {
    return new FormularBlockNode(node.__math, node.__key);
  }

  static importJSON(serializedNode: SerializedFormularBlockNode): FormularBlockNode {
    const { value } = serializedNode;
    return $createFormularBlockNode({ value });
  }

  constructor(value: string, key?: NodeKey) {
    super(key);

    this.__math = value;
  }

  exportJSON(): SerializedFormularBlockNode {
    return {
      value: this.getValue(),
      type: 'math',
      version: 1,
    };
  }

  createDOM(_config: EditorConfig): HTMLSpanElement {
    const div = document.createElement('div');
    div.className = clsx('dme-block-node', 'dme-formular-block');

    return div;
  }

  updateDOM(): false {
    return false;
  }

  getKey() {
    return this.__key;
  }

  getValue() {
    return this.__math;
  }

  setValue(value: string) {
    this.getWritable().__math = value;
  }

  select = () => {
    this.focusEmitter.publish();
  };

  decorate(parentEditor: LexicalEditor): JSX.Element {
    return <FormularBlock parentEditor={parentEditor} math={this.__math} formularNode={this} nodeKey={this.__key} />;
  }

  isInline(): boolean {
    return false;
  }
}

export function $createFormularBlockNode(options: CreateFormularBlockNodeOptions): FormularBlockNode {
  const { value } = options;
  return new FormularBlockNode(value);
}

export function $isFormularBlockNode(node: LexicalNode | null | undefined): node is FormularBlockNode {
  return node instanceof FormularBlockNode;
}
