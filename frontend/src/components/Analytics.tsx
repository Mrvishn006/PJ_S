import React, { useState, useEffect } from 'react';
import {
  getAnalyticsData,
  executeSQLQuery,
  type AnalyticsData,
  type SQLQueryResult
} from '../services/api';
import {
  Database,
  BarChart2,
  Table as TableIcon,
  Play,
  Terminal,
  Loader2,
  Layers,
  CheckCircle2
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sqlQuery, setSqlQuery] = useState(
    'SELECT location, COUNT(*) AS count, ROUND(AVG(price_per_sqft)) AS avg_rate, ROUND(AVG(total_price)) AS avg_price FROM properties GROUP BY location ORDER BY avg_rate DESC;'
  );
  const [queryResult, setQueryResult] = useState<SQLQueryResult | null>(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'metrics' | 'query' | 'schema'>('metrics');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await getAnalyticsData();
      setData(res);
      // Run initial SQL query
      const qRes = await executeSQLQuery(sqlQuery);
      setQueryResult(qRes);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunQuery = async () => {
    try {
      setQueryLoading(true);
      setQueryError(null);
      const res = await executeSQLQuery(sqlQuery);
      setQueryResult(res);
    } catch (err: any) {
      setQueryError(err.message || 'Execution error');
      setQueryResult(null);
    } finally {
      setQueryLoading(false);
    }
  };

  const sampleQueries = [
    {
      title: "Avg Rate by Location",
      sql: "SELECT location, COUNT(*) AS count, ROUND(AVG(price_per_sqft)) AS avg_rate, ROUND(AVG(total_price)) AS avg_price FROM properties GROUP BY location ORDER BY avg_rate DESC;"
    },
    {
      title: "Community Type Breakdown",
      sql: "SELECT property_type, COUNT(*) AS count, ROUND(AVG(price_per_sqft)) AS avg_sqft_rate, ROUND(AVG(total_price)) AS avg_valuation FROM properties GROUP BY property_type ORDER BY avg_sqft_rate DESC;"
    },
    {
      title: "Bedroom Size vs Price",
      sql: "SELECT bedrooms, COUNT(*) as units, ROUND(AVG(square_footage)) as avg_sqft, ROUND(AVG(total_price)) as avg_price FROM properties GROUP BY bedrooms ORDER BY bedrooms ASC;"
    },
    {
      title: "Top 5 Luxury Valuations",
      sql: "SELECT id, location, property_type, square_footage, price_per_sqft, total_price FROM properties ORDER BY total_price DESC LIMIT 5;"
    }
  ];

  if (loading) {
    return (
      <div className="dark-card" style={{ padding: '60px', textAlign: 'center' }}>
        <Loader2 size={32} className="animate-spin" color="#00e599" style={{ margin: '0 auto 16px' }} />
        <div style={{ color: '#94a3b8', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
          QUERYING MYSQL ANALYTICS REPOSITORY...
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Top Header Summary Metrics */}
      <div className="analytics-metrics-grid">
        <div className="stat-metric-card">
          <div className="stat-metric-label">TOTAL PROPERTIES RECORDED</div>
          <div className="stat-metric-value">{data?.total_records.toLocaleString()}</div>
          <div className="stat-metric-sub">SYNTHESIZED CSV PIPELINE</div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-metric-label">AVERAGE PROPERTY PRICE</div>
          <div className="stat-metric-value">{data?.formatted_avg_price}</div>
          <div className="stat-metric-sub">MEAN VALUATION INDEX</div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-metric-label">AVERAGE PRICE / SQ FT</div>
          <div className="stat-metric-value" style={{ color: 'var(--accent-teal)' }}>
            {data?.formatted_avg_sqft}
          </div>
          <div className="stat-metric-sub">BASELINE METROPOLITAN RATE</div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-metric-label">MEDIAN SQUARE FOOTAGE</div>
          <div className="stat-metric-value">{data?.median_square_footage.toLocaleString()} SQ FT</div>
          <div className="stat-metric-sub">RESIDENTIAL FOOTPRINT</div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
        <button
          className={`loc-btn ${activeSubTab === 'metrics' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('metrics')}
          style={{ width: 'auto', padding: '8px 16px' }}
        >
          <BarChart2 size={13} style={{ display: 'inline', marginRight: 6 }} />
          DISTRIBUTIONS & TABLES
        </button>
        <button
          className={`loc-btn ${activeSubTab === 'query' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('query')}
          style={{ width: 'auto', padding: '8px 16px' }}
        >
          <Terminal size={13} style={{ display: 'inline', marginRight: 6 }} />
          INTERACTIVE SQL CONSOLE
        </button>
        <button
          className={`loc-btn ${activeSubTab === 'schema' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('schema')}
          style={{ width: 'auto', padding: '8px 16px' }}
        >
          <Layers size={13} style={{ display: 'inline', marginRight: 6 }} />
          MYSQL SCHEMA DDL
        </button>
      </div>

      {/* SUBTAB 1: DISTRIBUTIONS & TABLES */}
      {activeSubTab === 'metrics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Location Breakdown Card */}
          <div className="dark-card">
            <div className="dark-card-header">
              <span className="dark-card-title">
                <Database size={15} color="#00e599" />
                LOCATION VALUATION BREAKDOWN
              </span>
              <span className="card-tag">6 MAJOR HUBS</span>
            </div>

            <div className="data-table-container">
              <table className="tech-table">
                <thead>
                  <tr>
                    <th>LOCATION</th>
                    <th>TIER PROFILE</th>
                    <th>SAMPLE UNITS</th>
                    <th>AVG PRICE / SQ FT</th>
                    <th>AVG TOTAL PRICE</th>
                    <th>RATE VISUALIZATION</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.location_breakdown.map((row) => (
                    <tr key={row.location}>
                      <td style={{ fontWeight: 700, color: '#ffffff' }}>{row.location}</td>
                      <td>
                        <span style={{ color: '#38bdf8', fontSize: '10px' }}>{row.tier}</span>
                      </td>
                      <td>{row.count}</td>
                      <td className="highlight">{row.formatted_avg_sqft}</td>
                      <td>{row.formatted_avg_price}</td>
                      <td style={{ width: '180px' }}>
                        <div className="feat-track">
                          <div
                            className="feat-fill"
                            style={{ width: `${Math.min(100, (row.avg_sqft_price / 35000) * 100)}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dual Grid: Property Types & Bedrooms */}
          <div className="dashboard-grid" style={{ marginTop: 0 }}>
            {/* Property Types */}
            <div className="dark-card">
              <div className="dark-card-header">
                <span className="dark-card-title">PROPERTY TYPE SEGMENTATION</span>
                <span className="card-tag">STRUCTURE TIER</span>
              </div>
              <div className="data-table-container">
                <table className="tech-table">
                  <thead>
                    <tr>
                      <th>COMMUNITY TYPE</th>
                      <th>UNITS</th>
                      <th>AVG TOTAL PRICE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.property_type_breakdown.map((pt) => (
                      <tr key={pt.property_type}>
                        <td style={{ color: '#ffffff', fontWeight: 600 }}>{pt.property_type}</td>
                        <td>{pt.count}</td>
                        <td className="highlight">{pt.formatted_avg_price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bedroom Distribution */}
            <div className="dark-card">
              <div className="dark-card-header">
                <span className="dark-card-title">BEDROOM (BHK) SCALE</span>
                <span className="card-tag">LAYOUT ANALYSIS</span>
              </div>
              <div className="data-table-container">
                <table className="tech-table">
                  <thead>
                    <tr>
                      <th>BEDROOMS</th>
                      <th>RECORDS</th>
                      <th>AVG VALUATION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.bedroom_distribution.map((b) => (
                      <tr key={b.bedrooms}>
                        <td style={{ color: '#ffffff', fontWeight: 600 }}>{b.bedrooms} BHK</td>
                        <td>{b.count} units</td>
                        <td className="highlight">{b.formatted_avg_price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Age Distribution */}
          <div className="dark-card">
            <div className="dark-card-header">
              <span className="dark-card-title">ASSET AGE DEPRECIATION CURVE</span>
              <span className="card-tag">CHRONO-COHORTS</span>
            </div>
            <div className="data-table-container">
              <table className="tech-table">
                <thead>
                  <tr>
                    <th>AGE BUCKET</th>
                    <th>COUNT</th>
                    <th>AVG TOTAL PRICE</th>
                    <th>AVG SQ FT RATE</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.age_distribution.map((a) => (
                    <tr key={a.bucket}>
                      <td style={{ color: '#ffffff', fontWeight: 600 }}>{a.bucket}</td>
                      <td>{a.count}</td>
                      <td>₹{a.avg_price.toLocaleString('en-IN')}</td>
                      <td className="highlight">₹{a.avg_sqft_price.toLocaleString('en-IN')}/sq ft</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: INTERACTIVE SQL CONSOLE */}
      {activeSubTab === 'query' && (
        <div className="dark-card">
          <div className="dark-card-header">
            <span className="dark-card-title">
              <Terminal size={15} color="#00e599" />
              LIVE SQL QUERY CONSOLE (MYSQL SYNTAX)
            </span>
            <span className="card-tag">READ-ONLY EXECUTION</span>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              PRESET ANALYTICS QUERIES:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
              {sampleQueries.map((q) => (
                <button
                  key={q.title}
                  type="button"
                  className="loc-btn"
                  style={{ fontSize: '10px', padding: '4px 10px' }}
                  onClick={() => setSqlQuery(q.sql)}
                >
                  {q.title}
                </button>
              ))}
            </div>
          </div>

          <textarea
            className="sql-input"
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            rows={3}
            placeholder="SELECT location, AVG(price_per_sqft) FROM properties GROUP BY location;"
          />

          <div className="sql-btn-row">
            <button
              type="button"
              className="btn-sql-run"
              onClick={handleRunQuery}
              disabled={queryLoading}
            >
              {queryLoading ? (
                <>
                  <Loader2 size={12} className="animate-spin" style={{ display: 'inline', marginRight: 4 }} />
                  EXECUTING...
                </>
              ) : (
                <>
                  <Play size={12} style={{ display: 'inline', marginRight: 4 }} />
                  RUN QUERY
                </>
              )}
            </button>
          </div>

          {queryError && (
            <div style={{ marginTop: '14px', padding: '10px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              ERROR: {queryError}
            </div>
          )}

          {queryResult && (
            <div style={{ marginTop: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '11px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                <span>ROWS RETURNED: {queryResult.row_count}</span>
                <span style={{ color: 'var(--accent-teal)' }}>EXECUTION TIME: {queryResult.execution_time_ms}ms</span>
              </div>

              <div className="data-table-container">
                <table className="tech-table">
                  <thead>
                    <tr>
                      {queryResult.columns.map((col) => (
                        <th key={col}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {queryResult.columns.map((col) => (
                          <td key={col}>
                            {typeof row[col] === 'number'
                              ? row[col].toLocaleString('en-IN')
                              : String(row[col])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: MYSQL SCHEMA DDL */}
      {activeSubTab === 'schema' && (
        <div className="dark-card">
          <div className="dark-card-header">
            <span className="dark-card-title">
              <TableIcon size={15} color="#00e599" />
              MYSQL PRODUCTION DATABASE SCHEMA DDL
            </span>
            <span className="card-tag">ENGINE=INNODB</span>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
            {data?.mysql_tables.map((t) => (
              <span key={t} className="card-tag" style={{ background: '#111e3b' }}>
                <CheckCircle2 size={10} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />
                TABLE: {t}
              </span>
            ))}
          </div>

          <pre className="code-display" style={{ maxHeight: '420px', overflowY: 'auto' }}>
{`-- VALUATE.AI Production MySQL Schema Definition
-- Engine: InnoDB | Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci

CREATE DATABASE IF NOT EXISTS valuate_ai_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE valuate_ai_db;

-- 1. Locations Table
CREATE TABLE IF NOT EXISTS locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    tier VARCHAR(50) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Properties Table (Core Ingestion Dataset)
CREATE TABLE IF NOT EXISTS properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(100) NOT NULL,
    property_type VARCHAR(100) NOT NULL,
    square_footage DECIMAL(10, 2) NOT NULL,
    bedrooms INT NOT NULL,
    bathrooms INT NOT NULL,
    property_age INT NOT NULL,
    metro_distance DECIMAL(5, 2) NOT NULL,
    schools_nearby INT NOT NULL,
    hospitals_nearby INT NOT NULL,
    price_per_sqft DECIMAL(12, 2) NOT NULL,
    total_price DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_location (location),
    INDEX idx_property_type (property_type),
    INDEX idx_sqft (square_footage)
) ENGINE=InnoDB;

-- 3. Model Metrics Table
CREATE TABLE IF NOT EXISTS model_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    model_depth INT NOT NULL,
    r2_score DECIMAL(6, 4) NOT NULL,
    mae DECIMAL(15, 2) NOT NULL,
    rmse DECIMAL(15, 2) NOT NULL,
    accuracy DECIMAL(5, 2) NOT NULL,
    trained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Predictions Log Table
CREATE TABLE IF NOT EXISTS predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NULL,
    location VARCHAR(100) NOT NULL,
    property_type VARCHAR(100) NOT NULL,
    square_footage DECIMAL(10, 2) NOT NULL,
    predicted_price DECIMAL(15, 2) NOT NULL,
    price_per_sqft DECIMAL(12, 2) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    model_accuracy DECIMAL(5, 2) NOT NULL,
    primary_feature VARCHAR(100) NOT NULL,
    prediction_time_ms DECIMAL(8, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_pred_loc (location),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- 5. Prediction Execution Logs
CREATE TABLE IF NOT EXISTS prediction_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(64) NOT NULL,
    client_ip VARCHAR(45) NULL,
    input_payload JSON NOT NULL,
    output_payload JSON NOT NULL,
    status_code INT NOT NULL,
    latency_ms DECIMAL(8, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;`}
          </pre>
        </div>
      )}
    </div>
  );
};
