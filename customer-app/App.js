import React, { useState } from 'react';
import { ThemeProvider } from './src/context/ThemeContext';
import { AppStateComposer } from './src/context/AppContext';
import { AppShell } from './src/shell/AppShell';
import MarketNavigator from './src/navigation/folders/MarketNavigator';

export default function App() {
  const [activeShellTab, setActiveShellTab] = useState('home');
  const [showShellTabs, setShowShellTabs] = useState(true);

  return (
    <ThemeProvider>
      <AppStateComposer>
        <AppShell
          showBottomTabBar={showShellTabs}
          activeTab={activeShellTab}
          onTabPress={setActiveShellTab}
        >
          <MarketNavigator
            activeTab={activeShellTab}
            onActiveTabChange={setActiveShellTab}
            onShellTabsVisibilityChange={setShowShellTabs}
            onAppMarketFlowComplete={(finalOrder) => console.log('Checkout:', finalOrder)}
          />
        </AppShell>
      </AppStateComposer>
    </ThemeProvider>
  );
}
