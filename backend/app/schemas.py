from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

class PredictionRequest(BaseModel):
    location: str = Field(default="Begumpet", description="Target location in Hyderabad")
    property_type: str = Field(default="Standalone Own Building", description="Community/Property type")
    square_footage: float = Field(default=1508, ge=500, le=10000, description="Square footage between 500 and 10000")
    bedrooms: int = Field(default=4, ge=1, le=10, description="Number of bedrooms")
    bathrooms: int = Field(default=3, ge=1, le=10, description="Number of bathrooms")
    property_age: int = Field(default=5, ge=0, le=100, description="Property age in years")
    metro_distance: float = Field(default=3.9, ge=0.0, le=50.0, description="Distance to nearest metro in km")
    schools_nearby: int = Field(default=4, ge=0, le=20, description="Number of schools within 3km")
    hospitals_nearby: int = Field(default=3, ge=0, le=20, description="Number of hospitals within 3km")

class FeatureImportanceItem(BaseModel):
    feature: str
    label: str
    importance: float
    percentage: float

class PredictionResponse(BaseModel):
    estimated_price: int
    price_per_sqft: int
    formatted_price: str
    formatted_rate: str
    model: str
    model_depth: int
    accuracy: float
    primary_driver: str
    primary_driver_weight: float
    feature_importance: Dict[str, float]
    feature_importance_list: List[FeatureImportanceItem]
    explanation: str
    explanation_secondary: str
    location_coordinates: Dict[str, Any]
    coordinates_str: str
    prediction_time_ms: float

class MetricCard(BaseModel):
    label: str
    value: str
    subtext: Optional[str] = None
    status: Optional[str] = None

class PipelineMetricsResponse(BaseModel):
    dataset_records: int
    train_records: int
    test_records: int
    model_name: str
    model_depth: int
    r2_score: float
    accuracy_pct: float
    mae: float
    rmse: float
    formatted_mae: str
    formatted_rmse: str
    training_status: str
    api_status: str
    pipeline_health: str
    prediction_latency_ms: float
    last_trained: str
    features_count: int
    top_features: List[FeatureImportanceItem]

class LocationStat(BaseModel):
    location: str
    count: int
    avg_price: int
    avg_sqft_price: int
    formatted_avg_price: str
    formatted_avg_sqft: str
    tier: str

class PropertyTypeStat(BaseModel):
    property_type: str
    count: int
    avg_price: int
    avg_sqft_price: int
    formatted_avg_price: str

class BedroomStat(BaseModel):
    bedrooms: int
    count: int
    avg_price: int
    formatted_avg_price: str

class AgeStat(BaseModel):
    bucket: str
    count: int
    avg_price: int
    avg_sqft_price: int

class AnalyticsResponse(BaseModel):
    total_records: int
    avg_property_price: int
    formatted_avg_price: str
    avg_sqft_price: int
    formatted_avg_sqft: str
    median_square_footage: int
    location_breakdown: List[LocationStat]
    property_type_breakdown: List[PropertyTypeStat]
    bedroom_distribution: List[BedroomStat]
    age_distribution: List[AgeStat]
    recent_properties: List[Dict[str, Any]]
    mysql_tables: List[str]

class SQLQueryRequest(BaseModel):
    query: str

class SQLQueryResponse(BaseModel):
    query: str
    columns: List[str]
    rows: List[Dict[str, Any]]
    row_count: int
    execution_time_ms: float
    status: str
