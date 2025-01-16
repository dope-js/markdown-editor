import { voidEmitter } from '@/utils';
import type { EditorConfig, LexicalEditor, LexicalNode, NodeKey, SerializedLexicalNode, Spread } from 'lexical';
import { DecoratorNode } from 'lexical';
import { InlineFormular } from './components';
import styles from './components/formular.module.scss';

export interface CreateFormularNodeOptions {
  value: string;
  isInsert?: boolean;
  autoFocus?: boolean;
}

export type SerializedFormularNode = Spread<
  CreateFormularNodeOptions & { type: 'inlineMath'; version: 1 },
  SerializedLexicalNode
>;

export class FormularNode extends DecoratorNode<JSX.Element> {
  __math: string;
  __autoFocus: boolean;
  __isInsert: boolean;
  focusEmitter = voidEmitter();

  static getType(): string {
    return 'inlineMath';
  }

  static clone(node: FormularNode): FormularNode {
    return new FormularNode(node.__math, false, false, node.__key);
  }

  static importJSON(serializedNode: SerializedFormularNode): FormularNode {
    const { value } = serializedNode;
    return $createFormularNode({ value });
  }

  constructor(value: string, isInsert = false, autoFocus = false, key?: NodeKey) {
    super(key);

    this.__math = value;
    this.__isInsert = isInsert;
    this.__autoFocus = autoFocus;
  }

  exportJSON(): SerializedFormularNode {
    return {
      value: this.getValue(),
      type: 'inlineMath',
      version: 1,
    };
  }

  createDOM(_config: EditorConfig): HTMLSpanElement {
    const span = document.createElement('span');
    span.className = styles.formular;

    return span;
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
    return (
      <InlineFormular
        math={this.__math}
        isInsert={this.__isInsert}
        autoFocus={this.__autoFocus}
        formularNode={this}
        nodeKey={this.getKey()}
        parentEditor={parentEditor}
      />
    );
  }

  isInline(): boolean {
    return true;
  }
}

export function $createFormularNode(options: CreateFormularNodeOptions): FormularNode {
  const { value, isInsert, autoFocus } = options;
  return new FormularNode(value, isInsert, autoFocus);
}

export function $isFormularNode(node: LexicalNode | null | undefined): node is FormularNode {
  return node instanceof FormularNode;
}
