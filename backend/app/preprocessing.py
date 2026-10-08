from typing import List
import pandas as pd

try:
    from app.schemas import PredictionRequest
except ImportError:
    from backend.app.schemas import PredictionRequest

FEATURE_COLUMNS: List[str] = [
    "square_footage",
    "bedrooms",
    "bathrooms",
    "property_age",
    "metro_distance",
    "schools_nearby",
    "hospitals_nearby",
    "loc_Banjara Hills",
    "loc_Begumpet",
    "loc_Gachibowli",
    "loc_Jubilee Hills",
    "loc_Kukatpally",
    "loc_Madhapur",
    "type_Gated Community",
    "type_Standalone Own Building",
    "type_Villa/Apt"
]

LOCATIONS: List[str] = [
    "Banjara Hills",
    "Begumpet",
    "Gachibowli",
    "Jubilee Hills",
    "Kukatpally",
    "Madhapur"
]

PROPERTY_TYPES: List[str] = [
    "Gated Community",
    "Standalone Own Building",
    "Villa/Apt"
]

def prepare_feature_vector(req: PredictionRequest) -> pd.DataFrame:
    """
    Transforms the incoming prediction request into a single-row DataFrame
    matching the exact column order and one-hot encoding used during model training.
    """
    row = {
        "square_footage": float(req.square_footage),
        "bedrooms": float(req.bedrooms),
        "bathrooms": float(req.bathrooms),
        "property_age": float(req.property_age),
        "metro_distance": float(req.metro_distance),
        "schools_nearby": float(req.schools_nearby),
        "hospitals_nearby": float(req.hospitals_nearby)
    }
    
    # Location one-hot encoding
    for loc in LOCATIONS:
        col_name = f"loc_{loc}"
        row[col_name] = 1.0 if req.location.strip().lower() == loc.lower() else 0.0
        
    # Property type one-hot encoding
    for ptype in PROPERTY_TYPES:
        col_name = f"type_{ptype}"
        row[col_name] = 1.0 if req.property_type.strip().lower() == ptype.lower() else 0.0
        
    df = pd.DataFrame([row])
    # Ensure exact feature order
    return df[FEATURE_COLUMNS]
