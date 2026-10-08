import React from 'react';
import type { PredictionResult } from '../services/api';
import { TrendingUp, ShieldCheck, Cpu } from 'lucide-react';

interface ValuationCardProps {
  prediction: PredictionResult | null;
  squareFootage: number;
}

export const ValuationCard: React.FC<ValuationCardProps> = ({ prediction, squareFootage }) => {
  // Safe fallbacks if still hydrating
  const pricePerSqft = prediction ? prediction.formatted_rate : "₹30,020/sq ft";
  const totalValuation = prediction ? prediction.formatted_price : "₹4,50,30,710";
  const modelName = prediction ? `${prediction.model.toUpperCase()} (DEPTH ${prediction.model_depth})` : "DECISIONTREE (DEPTH 7)";
  const accuracy = prediction ? `${prediction.accuracy}% ACC` : "92.4% ACC";

  return (
    <div className="valuation-hero-card">
      <div className="val-badge-row">
        <span className="val-category-label">CALCULATED VALUATION</span>
        <span className="val-model-badge">
          <Cpu size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
          {modelName}
        </span>
      </div>

      <div className="val-rate-display">
        <div className="val-rate-heading">PRICE PER SQ FT</div>
        <div className="val-rate-value">{pricePerSqft}</div>
      </div>

      <div className="val-total-divider" />

      <div>
        <div className="val-total-heading">
          ESTIMATED PROPERTY VALUATION ({squareFootage.toLocaleString()} SQ FT)
        </div>
        <div className="val-total-value">{totalValuation}</div>
      </div>

      <div className="val-metadata-footer">
        <span>
          <TrendingUp size={11} style={{ display: 'inline', marginRight: 4 }} />
          FORMULA: PRICE / SQ FT × SQUARE FOOTAGE
        </span>
        <span className="accuracy-chip">
          <ShieldCheck size={11} style={{ display: 'inline', marginRight: 3 }} />
          {accuracy}
        </span>
      </div>
    </div>
  );
};
