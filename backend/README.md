# VALUATE.AI — Backend API & Machine Learning Pipeline

Production FastAPI machine learning backend and analytics repository powering **VALUATE.AI — Real Estate Price Predictor** for Telangana (Hyderabad).

## Architecture

```text
backend/
├── app/
│   ├── main.py            # FastAPI router, CORS, endpoints (/predict, /metrics, /analytics, /blueprints)
│   ├── model.py           # ModelManager singleton & binary loader
│   ├── preprocessing.py   # Feature engineering & one-hot encoding
│   ├── predictor.py       # End-to-end inference & dynamic explanation generator
│   ├── schemas.py         # Pydantic schemas for request/response payloads
│   ├── database.py        # MySQL DDL & SQLite zero-config analytics engine
│   └── utils.py           # Indian currency formatting & NLP explanations
├── data/
│   ├── real_estate_dataset.csv  # 2,000 realistic Telangana property records
│   └── valuate_realestate.db    # Local analytics database
├── models/
│   ├── decision_tree_model.pkl  # Serialized DecisionTreeRegressor (depth 7)
│   └── model_metadata.json      # R2 score, MAE, RMSE, feature importances
├── train_model.py         # Data synthesis and model training pipeline
└── requirements.txt       # Python dependencies
```

## Setup & Running

### 1. Create Virtual Environment & Install Dependencies
```bash
python -m venv .venv
.\.venv\Scripts\pip install -r backend/requirements.txt
```

### 2. Retrain Machine Learning Model (Optional)
```bash
.\.venv\Scripts\python backend/train_model.py
```

### 3. Run FastAPI Backend Server
```bash
.\.venv\Scripts\uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

Interactive API documentation available at `http://127.0.0.1:8000/docs`.
