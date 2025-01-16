/** @internal */
export const canUseDom: boolean = typeof window !== 'undefined' && typeof window.document.createElement !== 'undefined';

/**
 * Used to detect if the current platform is Apple based, mostly for keyboard shortcuts.
 * @group Utils
 */
export const isApple: boolean = canUseDom && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

/**
 * Returns true if the user is pressing the control key on Windows or the meta key on Mac.
 * @group Utils
 */
export function controlOrMeta(metaKey: boolean, ctrlKey: boolean): boolean {
  if (isApple) {
    return metaKey;
  }
  return ctrlKey;
}
