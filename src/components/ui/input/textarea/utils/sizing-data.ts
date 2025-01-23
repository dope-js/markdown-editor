const sizingStyleKeys = [
  'borderBottomWidth',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'boxSizing',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'letterSpacing',
  'lineHeight',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  // non-standard
  'tabSize',
  'textIndent',
  // non-standard
  'textRendering',
  'textTransform',
  'width',
] as const;

export type SizingData = {
  sizingStyle: Record<(typeof sizingStyleKeys)[number], string>;
  paddingSize: number;
  borderSize: number;
};

export function getSizingData(node: HTMLTextAreaElement): SizingData | null {
  const style = window.getComputedStyle(node);
  if (style === null) return null;

  const sizingStyle = sizingStyleKeys.reduce(
    (memo, key) => {
      memo[key] = style[key];
      return memo;
    },
    {} as Record<(typeof sizingStyleKeys)[number], string>
  );

  const { boxSizing } = sizingStyle;

  if (boxSizing === '') {
    return null;
  }

  const paddingSize = parseFloat(style.paddingBottom) + parseFloat(style.paddingTop);

  const borderSize = parseFloat(style.borderBottomWidth) + parseFloat(style.borderTopWidth);

  return {
    sizingStyle,
    paddingSize,
    borderSize,
  };
}
