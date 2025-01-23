import type { EditorPlugin } from '@/types';
import { tap } from '@/utils';
import { Realm, RealmContext } from '@mdxeditor/gurx';
import type { ReactNode } from 'react';
import { useEffect, useMemo } from 'react';

/** @internal */
export function EditorWrapper({ children, plugins }: { children: ReactNode; plugins: EditorPlugin[] }) {
  const theRealm = useMemo(() => {
    return tap(new Realm(), (r) => {
      for (const plugin of plugins) {
        plugin.init?.(r);
      }
      for (const plugin of plugins) {
        plugin.postInit?.(r);
      }
    });
  }, []);

  useEffect(() => {
    for (const plugin of plugins) {
      plugin.update?.(theRealm);
    }
  });

  return <RealmContext.Provider value={theRealm}>{children}</RealmContext.Provider>;
}
