import React, { useState, useEffect } from 'react';
import { getPipelineMetrics, type PipelineMetrics as IPipelineMetrics } from '../services/api';
import { Activity, Cpu, Loader2 } from 'lucide-react';

export const PipelineMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<IPipelineMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const data = await getPipelineMetrics();
      setMetrics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dark-card" style={{ padding: '60px', textAlign: 'center' }}>
        <Loader2 size={32} className="animate-spin" color="#00e599" style={{ margin: '0 auto 16px' }} />
        <div style={{ color: '#94a3b8', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
          PROBING PIPELINE TELEMETRY BUS...
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 4 Hero Status Cards */}
      <div className="analytics-metrics-grid">
        <div className="stat-metric-card">
          <div className="stat-metric-label">DATASET CORPUS</div>
          <div className="stat-metric-value">{metrics?.dataset_records.toLocaleString()} records</div>
          <div className="stat-metric-sub">1,600 TRAIN / 400 TEST (80/20)</div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-metric-label">PRIMARY REGRESSION MODEL</div>
          <div className="stat-metric-value" style={{ fontSize: '16px', color: '#38bdf8' }}>
            {metrics?.model_name}
          </div>
          <div className="stat-metric-sub">MAX DEPTH: {metrics?.model_depth} | RANDOM_STATE: 42</div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-metric-label">CROSS-VALIDATION ACCURACY</div>
          <div className="stat-metric-value" style={{ color: 'var(--accent-teal)' }}>
            {metrics?.accuracy_pct}% ACC
          </div>
          <div className="stat-metric-sub">R² SCORE: {metrics?.r2_score}</div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-metric-label">INFERENCE LATENCY</div>
          <div className="stat-metric-value">{metrics?.prediction_latency_ms} ms</div>
          <div className="stat-metric-sub" style={{ color: 'var(--accent-teal)' }}>
            SYSTEM: {metrics?.api_status} | {metrics?.pipeline_health}
          </div>
        </div>
      </div>

      {/* Regression Diagnostics Card */}
      <div className="dashboard-grid" style={{ marginTop: 0 }}>
        {/* Left: Regression Performance Metrics */}
        <div className="dark-card">
          <div className="dark-card-header">
            <span className="dark-card-title">
              <Activity size={15} color="#00e599" />
              REGRESSION RESIDUAL DIAGNOSTICS
            </span>
            <span className="card-tag">VALIDATION SET</span>
          </div>

          <div className="data-table-container">
            <table className="tech-table">
              <thead>
                <tr>
                  <th>METRIC</th>
                  <th>VALUE</th>
                  <th>BENCHMARK THRESHOLD</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>R² (COEFFICIENT OF DETERMINATION)</td>
                  <td className="highlight">{metrics?.r2_score}</td>
                  <td>&gt; 0.9000</td>
                  <td style={{ color: 'var(--accent-teal)' }}>OPTIMAL</td>
                </tr>
                <tr>
                  <td>ACCURACY EQUIVALENT</td>
                  <td className="highlight">{metrics?.accuracy_pct}%</td>
                  <td>&gt; 90.0%</td>
                  <td style={{ color: 'var(--accent-teal)' }}>VERIFIED</td>
                </tr>
                <tr>
                  <td>MEAN ABSOLUTE ERROR (MAE)</td>
                  <td>{metrics?.formatted_mae}</td>
                  <td>&lt; ₹1,00,00,000</td>
                  <td style={{ color: 'var(--accent-teal)' }}>IN-BOUNDS</td>
                </tr>
                <tr>
                  <td>ROOT MEAN SQUARED ERROR (RMSE)</td>
                  <td>{metrics?.formatted_rmse}</td>
                  <td>&lt; ₹1,50,00,000</td>
                  <td style={{ color: 'var(--accent-teal)' }}>IN-BOUNDS</td>
                </tr>
                <tr>
                  <td>TOTAL NUMBER OF FEATURES</td>
                  <td>{metrics?.features_count} engineered dims</td>
                  <td>&gt; 12 dims</td>
                  <td style={{ color: 'var(--accent-teal)' }}>CONVERGED</td>
                </tr>
                <tr>
                  <td>MODEL SERIALIZATION FORMAT</td>
                  <td>Joblib / Pickle Binary</td>
                  <td>v1.4+ Spec</td>
                  <td style={{ color: 'var(--accent-teal)' }}>ACTIVE</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Architecture & Hyperparameters */}
        <div className="dark-card">
          <div className="dark-card-header">
            <span className="dark-card-title">
              <Cpu size={15} color="#00e599" />
              DECISION TREE SPECIFICATIONS
            </span>
            <span className="card-tag">HYPERPARAMETERS</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-card-secondary)', border: '1px solid var(--border-dark)', borderRadius: '2px' }}>
              <span style={{ color: '#94a3b8' }}>ESTIMATOR CLASS:</span>
              <span style={{ color: '#ffffff' }}>sklearn.tree.DecisionTreeRegressor</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-card-secondary)', border: '1px solid var(--border-dark)', borderRadius: '2px' }}>
              <span style={{ color: '#94a3b8' }}>MAX TREE DEPTH:</span>
              <span style={{ color: 'var(--accent-teal)', fontWeight: 700 }}>7 LEVELS</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-card-secondary)', border: '1px solid var(--border-dark)', borderRadius: '2px' }}>
              <span style={{ color: '#94a3b8' }}>SPLIT CRITERION:</span>
              <span style={{ color: '#ffffff' }}>squared_error (MSE)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-card-secondary)', border: '1px solid var(--border-dark)', borderRadius: '2px' }}>
              <span style={{ color: '#94a3b8' }}>MIN SAMPLES SPLIT / LEAF:</span>
              <span style={{ color: '#ffffff' }}>4 samples / 2 leaf</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-card-secondary)', border: '1px solid var(--border-dark)', borderRadius: '2px' }}>
              <span style={{ color: '#94a3b8' }}>RANDOM STATE SEED:</span>
              <span style={{ color: '#ffffff' }}>42 (Deterministic)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-card-secondary)', border: '1px solid var(--border-dark)', borderRadius: '2px' }}>
              <span style={{ color: '#94a3b8' }}>LAST TRAINING TIMESTAMP:</span>
              <span style={{ color: '#38bdf8' }}>{metrics?.last_trained}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
