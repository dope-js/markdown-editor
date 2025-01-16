import type { EditorPlugin } from '@/types';
import type { Realm } from '@mdxeditor/gurx';

/**
 * A function that creates an editor plugin.
 * @typeParam Params - The parameters for the plugin.
 * @group Core
 */
export function defineEditorPlugin<Params>(plugin: {
  /**
   * Called when the MDXEditor component is mounted and the plugin is initialized.
   */
  init?: (realm: Realm, params?: Params) => void;

  /**
   * Called after the MDXEditor component is mounted and all plugins are initialized.
   */
  postInit?: (realm: Realm, params?: Params) => void;
  /**
   * Called on each re-render. Use this to update the realm with updated property values.
   */
  update?: (realm: Realm, params?: Params) => void;
}): (params?: Params) => EditorPlugin {
  return function (params?: Params) {
    return {
      init: (realm: Realm) => plugin.init?.(realm, params),
      postInit: (realm: Realm) => plugin.postInit?.(realm, params),
      update: (realm: Realm) => plugin.update?.(realm, params),
    };
  };
}
