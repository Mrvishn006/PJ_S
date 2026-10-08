import React, { useState, useEffect } from 'react';
import { getBlueprints, type BlueprintStage } from '../services/api';
import { Terminal, Copy, Check, FileCode, Loader2 } from 'lucide-react';

export const PythonBlueprint: React.FC = () => {
  const [stages, setStages] = useState<BlueprintStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);

  useEffect(() => {
    loadBlueprints();
  }, []);

  const loadBlueprints = async () => {
    try {
      setLoading(true);
      const res = await getBlueprints();
      setStages(res.stages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (code: string, step: number) => {
    navigator.clipboard.writeText(code);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  if (loading) {
    return (
      <div className="dark-card" style={{ padding: '60px', textAlign: 'center' }}>
        <Loader2 size={32} className="animate-spin" color="#00e599" style={{ margin: '0 auto 16px' }} />
        <div style={{ color: '#94a3b8', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
          PARSING PYTHON BLUEPRINT ABSTRACT SYNTAX TREE...
        </div>
      </div>
    );
  }

  const currentStage = stages.find((s) => s.step === activeStep) || stages[0];

  return (
    <div>
      {/* Introduction banner */}
      <div className="dark-card" style={{ marginBottom: '20px' }}>
        <div className="dark-card-header">
          <span className="dark-card-title">
            <Terminal size={15} color="#00e599" />
            PYTHON MACHINE LEARNING ARCHITECTURE BLUEPRINTS
          </span>
          <span className="card-tag">11 PIPELINE STAGES</span>
        </div>
        <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>
          Complete production Python ML architecture corresponding to the live backend server.
          Explore the exact algorithmic stages: from CSV ingestion, spatial feature engineering,
          and one-hot encoding, through to the depth-7 DecisionTreeRegressor and FastAPI inference endpoint.
        </p>
      </div>

      {/* Stage Selector Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '8px', marginBottom: '20px' }}>
        {stages.map((stage) => {
          const isActive = stage.step === activeStep;
          return (
            <button
              key={stage.step}
              type="button"
              className={`loc-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveStep(stage.step)}
              style={{ textAlign: 'left', padding: '10px 12px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '9px', color: isActive ? 'var(--accent-teal)' : '#64748b' }}>
                  STAGE {String(stage.step).padStart(2, '0')}
                </span>
                <FileCode size={11} color={isActive ? 'var(--accent-teal)' : '#64748b'} />
              </div>
              <div style={{ fontSize: '11px', color: '#ffffff', marginTop: '2px', fontWeight: 600 }}>
                {stage.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Code Stage Display */}
      {currentStage && (
        <div className="blueprint-card">
          <div className="blueprint-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="blueprint-step-num">STAGE {currentStage.step}</span>
              <span className="blueprint-title">{currentStage.title}</span>
              <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                ({currentStage.filename})
              </span>
            </div>

            <button
              type="button"
              className="btn-copy-code"
              onClick={() => handleCopy(currentStage.code, currentStage.step)}
            >
              {copiedStep === currentStage.step ? (
                <>
                  <Check size={11} color="#00e599" style={{ display: 'inline', marginRight: 4 }} />
                  COPIED
                </>
              ) : (
                <>
                  <Copy size={11} style={{ display: 'inline', marginRight: 4 }} />
                  COPY CODE
                </>
              )}
            </button>
          </div>

          <pre className="code-display">
            <code>{currentStage.code}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
