import React from 'react';
import type { PropertyInput } from '../services/api';
import { Sliders, Zap, CheckCircle2, Loader2, MapPin } from 'lucide-react';

interface PropertyParametersProps {
  input: PropertyInput;
  onChange: (field: keyof PropertyInput, value: any) => void;
  onPredict: () => void;
  isLoading: boolean;
  statusMessage: string;
}

const LOCATIONS = [
  "BANJARA HILLS",
  "JUBILEE HILLS",
  "GACHIBOWLI",
  "MADHAPUR",
  "KUKATPALLY",
  "BEGUMPET"
];

const PROPERTY_TYPES = [
  {
    id: "Standalone Own Building",
    label: "STANDALONE OWN BUILDING",
    description: "Private independent plot & structure. Direct ownership, zero monthly maintenance or gated amenities fees."
  },
  {
    id: "Gated Community",
    label: "GATED COMMUNITY",
    description: "Premium gated security, shared clubhouse, power backup, and community amenities."
  },
  {
    id: "Villa/Apt",
    label: "VILLA/APT",
    description: "Ultra-luxury high-rise apartment or independent villa enclave with lifestyle infrastructure and concierge."
  }
];

export const PropertyParameters: React.FC<PropertyParametersProps> = ({
  input,
  onChange,
  onPredict,
  isLoading,
  statusMessage
}) => {
  return (
    <div className="dark-card">
      <div className="dark-card-header">
        <span className="dark-card-title">
          <Sliders size={15} color="#00e599" />
          PROPERTY PARAMETERS
        </span>
        <span className="card-tag">CONFIG_STAGE_01</span>
      </div>

      {/* 1. TARGET LOCATION */}
      <div className="param-section">
        <div className="param-label-row">
          <span className="param-label">TARGET LOCATION</span>
          <span className="param-value-badge">
            <MapPin size={10} style={{ display: 'inline', marginRight: 3 }} />
            {input.location.toUpperCase()}
          </span>
        </div>
        <div className="location-btn-grid">
          {LOCATIONS.map((loc) => {
            const isActive = input.location.toUpperCase() === loc;
            return (
              <button
                key={loc}
                type="button"
                className={`loc-btn ${isActive ? 'active' : ''}`}
                onClick={() => onChange('location', loc === "BEGUMPET" ? "Begumpet" : loc.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' '))}
              >
                {loc}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. PROPERTY TYPE & COMMUNITY STRUCTURE */}
      <div className="param-section">
        <div className="param-label-row">
          <span className="param-label">PROPERTY TYPE & COMMUNITY STRUCTURE</span>
        </div>
        <div className="property-type-group">
          {PROPERTY_TYPES.map((type) => {
            const isSelected = input.property_type.toLowerCase() === type.id.toLowerCase();
            return (
              <div
                key={type.id}
                className={`prop-type-item ${isSelected ? 'active' : ''}`}
                onClick={() => onChange('property_type', type.id)}
              >
                <div className="prop-type-header">
                  <span className="prop-type-name">{type.label}</span>
                  {isSelected && <CheckCircle2 size={13} color="#00e599" />}
                </div>
                <p className="prop-type-desc">{type.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. SQUARE FOOTAGE */}
      <div className="param-section">
        <div className="param-label-row">
          <span className="param-label">SQUARE FOOTAGE</span>
          <span className="param-value-badge">
            {input.square_footage.toLocaleString()} SQ FT
          </span>
        </div>
        <div className="slider-container">
          <input
            type="range"
            min="500"
            max="10000"
            step="10"
            value={input.square_footage}
            onChange={(e) => onChange('square_footage', Number(e.target.value))}
            className="custom-range"
          />
          <input
            type="number"
            min="500"
            max="10000"
            value={input.square_footage}
            onChange={(e) => onChange('square_footage', Math.max(500, Math.min(10000, Number(e.target.value) || 500)))}
            className="range-number-box"
          />
        </div>
      </div>

      {/* 4. BEDROOMS & BATHROOMS DUAL GRID */}
      <div className="param-section dual-param-grid">
        {/* BEDROOMS */}
        <div>
          <div className="param-label-row">
            <span className="param-label">BEDROOMS</span>
            <span className="param-value-badge">{input.bedrooms} BHK</span>
          </div>
          <div className="segmented-control">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                type="button"
                className={`segment-btn ${input.bedrooms === num ? 'active' : ''}`}
                onClick={() => onChange('bedrooms', num)}
              >
                {num === 6 ? '6+' : num}
              </button>
            ))}
          </div>
        </div>

        {/* BATHROOMS */}
        <div>
          <div className="param-label-row">
            <span className="param-label">BATHROOMS</span>
            <span className="param-value-badge">{input.bathrooms} BA</span>
          </div>
          <div className="segmented-control">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                type="button"
                className={`segment-btn ${input.bathrooms === num ? 'active' : ''}`}
                onClick={() => onChange('bathrooms', num)}
              >
                {num === 6 ? '6+' : num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. PROPERTY AGE & METRO DISTANCE DUAL GRID */}
      <div className="param-section dual-param-grid">
        {/* PROPERTY AGE */}
        <div>
          <div className="param-label-row">
            <span className="param-label">PROPERTY AGE</span>
            <span className="param-value-badge">{input.property_age} YRS</span>
          </div>
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={input.property_age}
              onChange={(e) => onChange('property_age', Number(e.target.value))}
              className="custom-range"
            />
            <input
              type="number"
              min="0"
              max="50"
              value={input.property_age}
              onChange={(e) => onChange('property_age', Math.max(0, Math.min(50, Number(e.target.value) || 0)))}
              className="range-number-box"
              style={{ width: '65px' }}
            />
          </div>
        </div>

        {/* METRO DISTANCE */}
        <div>
          <div className="param-label-row">
            <span className="param-label">METRO DISTANCE</span>
            <span className="param-value-badge">{input.metro_distance.toFixed(1)} KM</span>
          </div>
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="30"
              step="0.1"
              value={input.metro_distance}
              onChange={(e) => onChange('metro_distance', Number(e.target.value))}
              className="custom-range"
            />
            <input
              type="number"
              min="0"
              max="30"
              step="0.1"
              value={input.metro_distance}
              onChange={(e) => onChange('metro_distance', Math.max(0, Math.min(30, Number(e.target.value) || 0)))}
              className="range-number-box"
              style={{ width: '65px' }}
            />
          </div>
        </div>
      </div>

      {/* 6. SCHOOLS & HOSPITALS NEARBY */}
      <div className="param-section dual-param-grid">
        {/* SCHOOLS NEARBY */}
        <div>
          <div className="param-label-row">
            <span className="param-label">SCHOOLS NEARBY</span>
            <span className="param-value-badge">{input.schools_nearby}</span>
          </div>
          <div className="segmented-control">
            {[0, 1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
              <button
                key={num}
                type="button"
                className={`segment-btn ${input.schools_nearby === num ? 'active' : ''}`}
                onClick={() => onChange('schools_nearby', num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* HOSPITALS NEARBY */}
        <div>
          <div className="param-label-row">
            <span className="param-label">HOSPITALS NEARBY</span>
            <span className="param-value-badge">{input.hospitals_nearby}</span>
          </div>
          <div className="segmented-control">
            {[0, 1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
              <button
                key={num}
                type="button"
                className={`segment-btn ${input.hospitals_nearby === num ? 'active' : ''}`}
                onClick={() => onChange('hospitals_nearby', num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 7. PREDICT BUTTON & STATUS BAR */}
      <div className="predict-btn-row">
        <button
          type="button"
          className="btn-predict"
          onClick={onPredict}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              RUNNING PREDICTION ENGINE...
            </>
          ) : (
            <>
              <Zap size={16} />
              GENERATE LIVE AI PREDICTION →
            </>
          )}
        </button>

        <div className="engine-status-indicator">
          <span>
            <span className={`status-dot ${isLoading ? 'amber' : 'green'}`} />
            STATUS: {statusMessage}
          </span>
          <span>LATENCY: &lt; 4ms</span>
        </div>
      </div>
    </div>
  );
};
