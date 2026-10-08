import React from 'react';
import type { FeatureImportanceItem } from '../services/api';
import { BarChart3 } from 'lucide-react';

interface FeatureImportanceProps {
  features?: FeatureImportanceItem[];
  primaryDriver?: string;
  primaryWeight?: number;
}

export const FeatureImportance: React.FC<FeatureImportanceProps> = ({
  features = [],
  primaryDriver = "Square Footage",
  primaryWeight = 51.8
}) => {
  return (
    <div className="dark-card" style={{ marginBottom: '20px' }}>
      <div className="dark-card-header">
        <div>
          <span className="dark-card-title">
            <BarChart3 size={15} color="#00e599" />
            FEATURE IMPORTANCE
          </span>
          <div className="dark-card-subtitle" style={{ marginTop: '2px' }}>
            RELATIVE IMPACT BREAKDOWN OF THIS PREDICTION
          </div>
        </div>
        <span className="card-tag">SPLIT REDUCTION</span>
      </div>

      <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '12px' }}>
        PRIMARY FACTOR:{' '}
        <strong style={{ color: '#00e599' }}>{primaryDriver}</strong> —{' '}
        <span style={{ fontFamily: 'var(--font-mono)' }}>{primaryWeight}% relative importance</span>
      </div>

      <div className="feat-bar-list">
        {features.map((item, index) => {
          const isPrimary = index === 0;
          return (
            <div key={item.feature} className="feat-bar-item">
              <div className="feat-bar-info">
                <span className="feat-bar-name">
                  {index + 1}. {item.label}
                </span>
                <span className="feat-bar-pct">{item.percentage}%</span>
              </div>
              <div className="feat-track">
                <div
                  className={`feat-fill ${isPrimary ? 'primary' : ''}`}
                  style={{ width: `${Math.min(100, Math.max(2, item.percentage))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
