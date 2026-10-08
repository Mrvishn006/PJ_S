export interface PropertyInput {
  location: string;
  property_type: string;
  square_footage: number;
  bedrooms: number;
  bathrooms: number;
  property_age: number;
  metro_distance: number;
  schools_nearby: number;
  hospitals_nearby: number;
}

export interface FeatureImportanceItem {
  feature: string;
  label: string;
  importance: number;
  percentage: number;
}

export interface PredictionResult {
  estimated_price: number;
  price_per_sqft: number;
  formatted_price: string;
  formatted_rate: string;
  model: string;
  model_depth: number;
  accuracy: number;
  primary_driver: string;
  primary_driver_weight: number;
  feature_importance: Record<string, number>;
  feature_importance_list: FeatureImportanceItem[];
  explanation: string;
  explanation_secondary: string;
  location_coordinates: {
    lat: number;
    lng: number;
    tier: string;
    pincode: string;
  };
  coordinates_str: string;
  prediction_time_ms: number;
}

export interface PipelineMetrics {
  dataset_records: number;
  train_records: number;
  test_records: number;
  model_name: string;
  model_depth: number;
  r2_score: number;
  accuracy_pct: number;
  mae: number;
  rmse: number;
  formatted_mae: string;
  formatted_rmse: string;
  training_status: string;
  api_status: string;
  pipeline_health: string;
  prediction_latency_ms: number;
  last_trained: string;
  features_count: number;
  top_features: FeatureImportanceItem[];
}

export interface LocationStat {
  location: string;
  count: number;
  avg_price: number;
  avg_sqft_price: number;
  formatted_avg_price: string;
  formatted_avg_sqft: string;
  tier: string;
}

export interface PropertyTypeStat {
  property_type: string;
  count: number;
  avg_price: number;
  avg_sqft_price: number;
  formatted_avg_price: string;
}

export interface BedroomStat {
  bedrooms: number;
  count: number;
  avg_price: number;
  formatted_avg_price: string;
}

export interface AgeStat {
  bucket: string;
  count: number;
  avg_price: number;
  avg_sqft_price: number;
}

export interface AnalyticsData {
  total_records: number;
  avg_property_price: number;
  formatted_avg_price: string;
  avg_sqft_price: number;
  formatted_avg_sqft: string;
  median_square_footage: number;
  location_breakdown: LocationStat[];
  property_type_breakdown: PropertyTypeStat[];
  bedroom_distribution: BedroomStat[];
  age_distribution: AgeStat[];
  recent_properties: Array<Record<string, any>>;
  mysql_tables: string[];
}

export interface SQLQueryResult {
  query: string;
  columns: string[];
  rows: Array<Record<string, any>>;
  row_count: number;
  execution_time_ms: number;
  status: string;
}

export interface BlueprintStage {
  step: number;
  title: string;
  filename: string;
  code: string;
}

export interface BlueprintsData {
  schema_ddl: string;
  stages: BlueprintStage[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export async function predictProperty(input: PropertyInput): Promise<PredictionResult> {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  return response.json();
}

export async function getPipelineMetrics(): Promise<PipelineMetrics> {
  const response = await fetch(`${API_BASE_URL}/metrics`);
  if (!response.ok) {
    throw new Error(`Failed to fetch pipeline metrics (${response.status})`);
  }
  return response.json();
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const response = await fetch(`${API_BASE_URL}/analytics`);
  if (!response.ok) {
    throw new Error(`Failed to fetch analytics data (${response.status})`);
  }
  return response.json();
}

export async function executeSQLQuery(query: string): Promise<SQLQueryResult> {
  const response = await fetch(`${API_BASE_URL}/analytics/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || 'SQL query execution failed');
  }

  return response.json();
}

export async function getBlueprints(): Promise<BlueprintsData> {
  const response = await fetch(`${API_BASE_URL}/blueprints`);
  if (!response.ok) {
    throw new Error(`Failed to fetch blueprints (${response.status})`);
  }
  return response.json();
}
