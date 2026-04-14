/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './components/Dashboard';
import { Investments } from './components/Investments';
import { Expenses } from './components/Expenses';
import { Subscriptions } from './components/Subscriptions';
import { Settings } from './components/Settings';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard': return <Dashboard />;
      case 'investments': return <Investments />;
      case 'expenses': return <Expenses />;
      case 'subscriptions': return <Subscriptions />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex bg-background min-h-screen font-body text-on-surface antialiased overflow-x-hidden">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

