import React from 'react';
import { DEFAULT_TAB, getHashForTab, getTabFromHash, normalizeHash } from '../lib/routes';

export function useHashRoute() {
  const [activeTab, setActiveTab] = React.useState(() => getTabFromHash(window.location.hash));

  React.useEffect(() => {
    const handleHashChange = () => {
      setActiveTab(getTabFromHash(window.location.hash));
    };

    if (!window.location.hash) {
      window.history.replaceState(null, '', getHashForTab(DEFAULT_TAB));
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToTab = React.useCallback((tab: string) => {
    const nextHash = getHashForTab(tab);
    if (normalizeHash(window.location.hash) !== nextHash) {
      window.location.hash = nextHash;
      return;
    }
    setActiveTab(tab);
  }, []);

  return { activeTab, navigateToTab };
}
