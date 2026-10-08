import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, type TabType } from './components/Navigation';
import { PropertyParameters } from './components/PropertyParameters';
import { ValuationCard } from './components/ValuationCard';
import { FeatureImportance } from './components/FeatureImportance';
import { DecisionExplanation } from './components/DecisionExplanation';
import { Analytics } from './components/Analytics';
import { PipelineMetrics } from './components/PipelineMetrics';
import { PythonBlueprint } from './components/PythonBlueprint';
import { type PropertyInput, type PredictionResult, predictProperty } from './services/api';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const INITIAL_PROPERTY: PropertyInput = {
  location: "Begumpet",
  property_type: "Standalone Own Building",
  square_footage: 1508,
  bedrooms: 4,
  bathrooms: 3,
  property_age: 5,
  metro_distance: 3.9,
  schools_nearby: 4,
  hospitals_nearby: 3
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('predict');
  const [property, setProperty] = useState<PropertyInput>(INITIAL_PROPERTY);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("SYSTEM: READY");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Run initial prediction on boot
  useEffect(() => {
    executePrediction(INITIAL_PROPERTY);
  }, []);

  const executePrediction = async (currentProperty: PropertyInput) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      setStatusMessage("RUNNING PREDICTION ENGINE...");

      const result = await predictProperty(currentProperty);
      setPrediction(result);
      setStatusMessage("SYSTEM: READY");
    } catch (err: any) {
      console.error("Prediction error:", err);
      setErrorMessage(
        "PREDICTION ENGINE UNAVAILABLE — Please verify that the FastAPI backend is running at http://127.0.0.1:8000."
      );
      setStatusMessage("SYSTEM: OFFLINE / FALLBACK");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: keyof PropertyInput, value: any) => {
    setProperty((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGeneratePrediction = () => {
    executePrediction(property);
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header
        modelAccuracy={prediction?.accuracy || 92.4}
        datasetBadge="JAD DATASET (2K CSV)"
      />

      {/* Top Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Workspace Content */}
      <main className="main-content">
        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            borderRadius: '4px',
            padding: '12px 18px',
            marginBottom: '18px',
            color: '#fca5a5',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={15} color="#ef4444" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => executePrediction(property)}
              className="btn-copy-code"
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <RefreshCw size={11} /> RETRY CONNECTION
            </button>
          </div>
        )}

        {/* TAB 1: PREDICT PRICE DASHBOARD */}
        {activeTab === 'predict' && (
          <div className="dashboard-grid">
            {/* LEFT COLUMN: Input Configuration Panel (55-60%) */}
            <div>
              <PropertyParameters
                input={property}
                onChange={handleFieldChange}
                onPredict={handleGeneratePrediction}
                isLoading={loading}
                statusMessage={statusMessage}
              />
            </div>

            {/* RIGHT COLUMN: Prediction & Valuation Panel (40-45%) */}
            <div>
              <ValuationCard
                prediction={prediction}
                squareFootage={property.square_footage}
              />

              <FeatureImportance
                features={prediction?.feature_importance_list}
                primaryDriver={prediction?.primary_driver}
                primaryWeight={prediction?.primary_driver_weight}
              />

              <DecisionExplanation
                explanation={
                  prediction?.explanation ||
                  `ESTIMATED VALUATION IS ₹4,50,30,710 AT ₹30,020/SQ FT FOR THIS 1,508 SQ FT INDEPENDENT OWN STANDALONE BUILDING IN BEGUMPET.`
                }
                explanationSecondary={
                  prediction?.explanation_secondary ||
                  `THE PRIMARY DRIVER VARIABLE OF THIS VALUATION IS SQUARE FOOTAGE (51.8% RELATIVE IMPORTANCE WEIGHT).`
                }
                coordinatesStr={
                  prediction?.coordinates_str ||
                  "Lat: 17.4447° N, Long: 78.4664° E (BEGUMPET, HYDERABAD, TELANGANA)"
                }
              />
            </div>
          </div>
        )}

        {/* TAB 2: MYSQL ANALYTICS */}
        {activeTab === 'analytics' && <Analytics />}

        {/* TAB 3: PIPELINE METRICS */}
        {activeTab === 'metrics' && <PipelineMetrics />}

        {/* TAB 4: PYTHON BLUEPRINTS */}
        {activeTab === 'blueprints' && <PythonBlueprint />}
      </main>
    </div>
  );
};

export default App;
