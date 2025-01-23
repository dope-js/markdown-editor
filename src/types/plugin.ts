import type { Realm } from '@mdxeditor/gurx';

/**
 * A plugin for the editor.
 * @group Core
 */
export interface EditorPlugin {
  init?: (realm: Realm) => void;
  update?: (realm: Realm) => void;
  postInit?: (realm: Realm) => void;
}
