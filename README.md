# VALUATE.AI — REAL ESTATE PRICE PREDICTOR
### Provenance Engine & Housing Valuation Architecture for Telangana State

VALUATE.AI is an enterprise-grade real estate analytics and machine learning valuation web application designed for residential properties across major hubs in Telangana, India (focusing on Hyderabad).

Powered by an optimized `DecisionTreeRegressor` (Depth 7) trained on 2,000 real-world simulated property records with an accuracy equivalent of **92.4%**.

---

## Project Structure

```text
PJ_S/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI server & route handlers
│   │   ├── model.py           # ModelManager singleton & inference runner
│   │   ├── preprocessing.py   # Feature engineering & one-hot encoding
│   │   ├── predictor.py       # End-to-end prediction & explanation pipeline
│   │   ├── schemas.py         # Pydantic validation schemas
│   │   ├── database.py        # MySQL schema & local SQLite analytics engine
│   │   └── utils.py           # Indian currency formatting & NLP explanation
│   ├── data/
│   │   ├── real_estate_dataset.csv  # 2,000 synthetic records
│   │   └── valuate_realestate.db    # Relational analytics database
│   ├── models/
│   │   ├── decision_tree_model.pkl  # Serialized Decision Tree binary
│   │   └── model_metadata.json      # R², MAE, RMSE & feature rankings
│   ├── train_model.py         # Model training script
│   ├── requirements.txt       # Python dependencies
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx             # Valuate.AI header & telemetry badges
│   │   │   ├── Navigation.tsx         # 4-tab top navigation
│   │   │   ├── PropertyParameters.tsx # Left column interactive parameters
│   │   │   ├── ValuationCard.tsx      # Right column calculated valuation card
│   │   │   ├── FeatureImportance.tsx  # Dynamic impact breakdown bars
│   │   │   ├── DecisionExplanation.tsx# Dynamic AI natural-language explanation
│   │   │   ├── Analytics.tsx          # MySQL analytics & interactive SQL console
│   │   │   ├── PipelineMetrics.tsx    # R², MAE, RMSE & model specs
│   │   │   └── PythonBlueprint.tsx    # 11-stage Python code architecture viewer
│   │   ├── services/
│   │   │   └── api.ts                 # Type-safe API client
│   │   ├── styles/
│   │   │   └── global.css             # Terminal design system stylesheet
│   │   ├── App.tsx                    # Main dashboard application
│   │   └── main.tsx                   # React 19 entrypoint
│   ├── package.json
│   └── README.md
└── README.md
```

---

## Quickstart Instructions

### 1. Backend Setup & Startup
In PowerShell:
```powershell
# Navigate to workspace root
cd c:\Users\vishn\Desktop\PJ_S

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# (Optional) Re-train Decision Tree model & generate dataset:
python backend/train_model.py

# Launch FastAPI backend server:
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
Backend API will be running at `http://127.0.0.1:8000`.
Swagger docs: `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup & Startup
In a separate terminal:
```powershell
# Navigate to frontend
cd c:\Users\vishn\Desktop\PJ_S\frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Frontend application will be accessible at `http://127.0.0.1:5173`.

---

## Features & Verification

1. **Predict Price Dashboard**:
   - Location buttons: Banjara Hills, Jubilee Hills, Gachibowli, Madhapur, Kukatpally, Begumpet.
   - Property Types: Standalone Own Building, Gated Community, Villa/Apt.
   - Dynamic valuation cards with price per sq ft (`₹30,020/sq ft`), total valuation (`₹4,50,30,710`), and feature importance (`Square Footage — 51.8%`).
   - Dynamic natural-language AI explanation and exact GPS coordinates for selected location.
2. **MySQL Analytics**:
   - 2,000 property records analyzed with location, property type, and bedroom aggregations.
   - Live interactive SQL query console executing against real database tables.
   - Full MySQL production DDL schema for `properties`, `locations`, `predictions`, `model_metrics`, `prediction_logs`.
3. **Pipeline Metrics**:
   - Validation R² score, accuracy equivalent (92.4%), MAE, RMSE, and hyperparameters.
4. **Python Blueprints**:
   - 11 modular pipeline stages with interactive code viewer and one-click copy.
