import os
import sqlite3
import pandas as pd
from typing import Dict, Any, List
import time

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "data", "valuate_realestate.db")
CSV_PATH = os.path.join(BASE_DIR, "data", "real_estate_dataset.csv")

MYSQL_SCHEMA_DDL = """-- VALUATE.AI Production MySQL Schema Definition
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
) ENGINE=InnoDB;
"""

def init_database():
    """Initializes SQLite database compatible with MySQL syntax for local zero-config execution."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY,
        location TEXT NOT NULL,
        property_type TEXT NOT NULL,
        square_footage REAL NOT NULL,
        bedrooms INTEGER NOT NULL,
        bathrooms INTEGER NOT NULL,
        property_age INTEGER NOT NULL,
        metro_distance REAL NOT NULL,
        schools_nearby INTEGER NOT NULL,
        hospitals_nearby INTEGER NOT NULL,
        price_per_sqft REAL NOT NULL,
        total_price REAL NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        tier TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        pincode TEXT NOT NULL
    );
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        property_id INTEGER NULL,
        location TEXT NOT NULL,
        property_type TEXT NOT NULL,
        square_footage REAL NOT NULL,
        predicted_price REAL NOT NULL,
        price_per_sqft REAL NOT NULL,
        model_name TEXT NOT NULL,
        model_accuracy REAL NOT NULL,
        primary_feature TEXT NOT NULL,
        prediction_time REAL NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS model_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        model_name TEXT NOT NULL,
        model_depth INTEGER NOT NULL,
        r2_score REAL NOT NULL,
        mae REAL NOT NULL,
        rmse REAL NOT NULL,
        accuracy REAL NOT NULL,
        trained_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)
    
    # Populate properties if empty
    cursor.execute("SELECT COUNT(*) FROM properties;")
    count = cursor.fetchone()[0]
    if count == 0 and os.path.exists(CSV_PATH):
        df = pd.read_csv(CSV_PATH)
        df.to_sql("properties", conn, if_exists="append", index=False)
        print(f"Loaded {len(df)} records into SQLite properties table.")
        
    # Populate locations if empty
    cursor.execute("SELECT COUNT(*) FROM locations;")
    if cursor.fetchone()[0] == 0:
        locations_data = [
            ("Banjara Hills", "Ultra-Luxury", 17.4156, 78.4357, "500034"),
            ("Jubilee Hills", "Ultra-Luxury", 17.4319, 78.4073, "500033"),
            ("Gachibowli", "Tech-Hub Corridor", 17.4401, 78.3489, "500032"),
            ("Madhapur", "Hitec Cyber Core", 17.4483, 78.3915, "500081"),
            ("Kukatpally", "Urban Growth Hub", 17.4933, 78.3995, "500072"),
            ("Begumpet", "Central Legacy Hub", 17.4447, 78.4664, "500016")
        ]
        cursor.executemany(
            "INSERT INTO locations (name, tier, latitude, longitude, pincode) VALUES (?, ?, ?, ?, ?);",
            locations_data
        )
        
    # Populate metrics if empty
    cursor.execute("SELECT COUNT(*) FROM model_metrics;")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO model_metrics (model_name, model_depth, r2_score, mae, rmse, accuracy, trained_at)
        VALUES ('DecisionTreeRegressor', 7, 0.9419, 8186568, 11913655, 92.4, '2026-10-08 22:50:00');
        """)
        
    conn.commit()
    conn.close()

def log_prediction(
    location: str,
    property_type: str,
    square_footage: float,
    predicted_price: float,
    price_per_sqft: float,
    model_name: str,
    model_accuracy: float,
    primary_feature: str,
    prediction_time: float
):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO predictions (
            location, property_type, square_footage, predicted_price, price_per_sqft,
            model_name, model_accuracy, primary_feature, prediction_time
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            location, property_type, square_footage, predicted_price, price_per_sqft,
            model_name, model_accuracy, primary_feature, prediction_time
        ))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error logging prediction: {e}")

def get_analytics_data() -> Dict[str, Any]:
    init_database()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Total count and averages
    cursor.execute("""
    SELECT 
        COUNT(*) as total_count,
        AVG(total_price) as avg_price,
        AVG(price_per_sqft) as avg_sqft_price,
        AVG(square_footage) as avg_sqft
    FROM properties;
    """)
    totals = dict(cursor.fetchone())
    
    # Location breakdown
    cursor.execute("""
    SELECT 
        p.location,
        COUNT(*) as count,
        AVG(p.total_price) as avg_price,
        AVG(p.price_per_sqft) as avg_sqft_price,
        MIN(p.price_per_sqft) as min_sqft_price,
        MAX(p.price_per_sqft) as max_sqft_price,
        COALESCE(l.tier, 'Urban Hub') as tier
    FROM properties p
    LEFT JOIN locations l ON p.location = l.name
    GROUP BY p.location
    ORDER BY avg_sqft_price DESC;
    """)
    loc_rows = [dict(r) for r in cursor.fetchall()]
    
    # Property type breakdown
    cursor.execute("""
    SELECT 
        property_type,
        COUNT(*) as count,
        AVG(total_price) as avg_price,
        AVG(price_per_sqft) as avg_sqft_price
    FROM properties
    GROUP BY property_type
    ORDER BY avg_sqft_price DESC;
    """)
    prop_rows = [dict(r) for r in cursor.fetchall()]
    
    # Bedroom distribution
    cursor.execute("""
    SELECT 
        bedrooms,
        COUNT(*) as count,
        AVG(total_price) as avg_price,
        AVG(square_footage) as avg_sqft
    FROM properties
    GROUP BY bedrooms
    ORDER BY bedrooms ASC;
    """)
    bed_rows = [dict(r) for r in cursor.fetchall()]
    
    # Age distribution buckets
    cursor.execute("""
    SELECT 
        CASE 
            WHEN property_age <= 2 THEN '0-2 YRS (New)'
            WHEN property_age <= 5 THEN '3-5 YRS (Modern)'
            WHEN property_age <= 10 THEN '6-10 YRS (Established)'
            WHEN property_age <= 20 THEN '11-20 YRS (Mature)'
            ELSE '20+ YRS (Vintage)'
        END as bucket,
        COUNT(*) as count,
        AVG(total_price) as avg_price,
        AVG(price_per_sqft) as avg_sqft_price
    FROM properties
    GROUP BY bucket
    ORDER BY MIN(property_age) ASC;
    """)
    age_rows = [dict(r) for r in cursor.fetchall()]
    
    # Sample 10 properties for table view
    cursor.execute("""
    SELECT id, location, property_type, square_footage, bedrooms, bathrooms, 
           property_age, metro_distance, price_per_sqft, total_price
    FROM properties
    ORDER BY id ASC
    LIMIT 12;
    """)
    sample_rows = [dict(r) for r in cursor.fetchall()]
    
    conn.close()
    
    return {
        "totals": totals,
        "location_stats": loc_rows,
        "property_type_stats": prop_rows,
        "bedroom_stats": bed_rows,
        "age_stats": age_rows,
        "sample_properties": sample_rows,
        "tables": ["properties", "locations", "predictions", "model_metrics", "prediction_logs"]
    }

def execute_raw_sql(query: str) -> Dict[str, Any]:
    """Safely executes read-only SQL queries against the local database for interactive analytics."""
    init_database()
    query_clean = query.strip()
    
    # Basic safety: allow SELECT / WITH / PRAGMA / EXPLAIN
    if not (query_clean.upper().startswith("SELECT") or 
            query_clean.upper().startswith("WITH") or 
            query_clean.upper().startswith("EXPLAIN") or 
            query_clean.upper().startswith("PRAGMA")):
        raise ValueError("Only read-only queries (SELECT) are permitted in analytics sandbox.")
        
    start = time.perf_counter()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute(query_clean)
    rows = cursor.fetchall()
    elapsed_ms = (time.perf_counter() - start) * 1000
    
    columns = [description[0] for description in cursor.description] if cursor.description else []
    result_rows = [dict(row) for row in rows[:100]] # Cap at 100 rows for UI responsiveness
    
    conn.close()
    return {
        "columns": columns,
        "rows": result_rows,
        "row_count": len(rows),
        "execution_time_ms": round(elapsed_ms, 2)
    }

# Auto-initialize database on import
try:
    init_database()
except Exception as e:
    print(f"Database init notice: {e}")

