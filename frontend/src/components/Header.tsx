import React from 'react';

interface HeaderProps {
  modelAccuracy?: number;
  datasetBadge?: string;
}

export const Header: React.FC<HeaderProps> = ({
  modelAccuracy = 92.4,
  datasetBadge = "JAD DATASET (2K CSV)"
}) => {
  return (
    <header className="header-container">
      <div className="header-top">
        <div className="header-brand-group">
          <div className="header-brand-line">
            <span className="brand-logo">
              VALUATE<span>.AI</span>
            </span>
            <span className="provenance-badge">PROVENANCE ENGINE</span>
          </div>
          <h1 className="header-main-title">REAL ESTATE PRICE PREDICTOR</h1>
          <p className="header-subtitle">
            FORECASTING REAL ESTATE AND HOUSING VALUATION ACROSS MAJOR HUBS IN TELANGANA STATE USING AN OPTIMIZED REGRESSION TREE TRAINED ON 2,000 REAL-WORLD SIMULATED DATA LINES
          </p>
        </div>

        <div className="header-status-group">
          <div className="status-pill">
            <span className="status-pill-label">SOURCE REPOSITORY</span>
            <span className="status-pill-value">{datasetBadge}</span>
          </div>

          <div className="status-pill">
            <span className="status-pill-label">MODEL ACCURACY</span>
            <span className="status-pill-value highlight-green">{modelAccuracy}% ACC</span>
          </div>
        </div>
      </div>
    </header>
  );
};
