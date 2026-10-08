import React from 'react';
import { Activity, Database, GitBranch, Terminal } from 'lucide-react';

export type TabType = 'predict' | 'analytics' | 'metrics' | 'blueprints';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="nav-bar">
      <button
        className={`nav-tab-btn ${activeTab === 'predict' ? 'active' : ''}`}
        onClick={() => onTabChange('predict')}
      >
        <Activity size={14} className="tab-icon" />
        PREDICT PRICE
      </button>

      <button
        className={`nav-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
        onClick={() => onTabChange('analytics')}
      >
        <Database size={14} className="tab-icon" />
        MYSQL ANALYTICS
      </button>

      <button
        className={`nav-tab-btn ${activeTab === 'metrics' ? 'active' : ''}`}
        onClick={() => onTabChange('metrics')}
      >
        <GitBranch size={14} className="tab-icon" />
        PIPELINE METRICS
      </button>

      <button
        className={`nav-tab-btn ${activeTab === 'blueprints' ? 'active' : ''}`}
        onClick={() => onTabChange('blueprints')}
      >
        <Terminal size={14} className="tab-icon" />
        PYTHON BLUEPRINTS
      </button>
    </nav>
  );
};
