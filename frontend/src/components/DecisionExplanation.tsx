import React from 'react';
import { Sparkles, Compass } from 'lucide-react';

interface DecisionExplanationProps {
  explanation: string;
  explanationSecondary: string;
  coordinatesStr: string;
}

export const DecisionExplanation: React.FC<DecisionExplanationProps> = ({
  explanation,
  explanationSecondary,
  coordinatesStr
}) => {
  return (
    <div className="dark-card explanation-card">
      <div className="dark-card-header">
        <span className="dark-card-title">
          <Sparkles size={15} color="#00e599" />
          DECISION EXPLANATION
        </span>
        <span className="card-tag">NATURAL_LANGUAGE_AI</span>
      </div>

      <div className="explanation-body">
        <p style={{ marginBottom: '10px' }}>{explanation}</p>
        <p style={{ color: '#94a3b8' }}>{explanationSecondary}</p>
      </div>

      <div className="location-coords-footer">
        <Compass size={13} color="#38bdf8" />
        <span>{coordinatesStr}</span>
      </div>
    </div>
  );
};
