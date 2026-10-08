import os
import json
import pickle
import time
from typing import Dict, Any, Optional

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")
MODEL_PATH = os.path.join(MODELS_DIR, "decision_tree_model.pkl")
METADATA_PATH = os.path.join(MODELS_DIR, "model_metadata.json")

class ModelManager:
    _instance: Optional["ModelManager"] = None

    def __init__(self):
        self.model = None
        self.metadata: Dict[str, Any] = {}
        self.is_loaded = False
        self.load_model()

    @classmethod
    def get_instance(cls) -> "ModelManager":
        if cls._instance is None:
            cls._instance = ModelManager()
        return cls._instance

    def load_model(self):
        if not os.path.exists(MODEL_PATH) or not os.path.exists(METADATA_PATH):
            raise FileNotFoundError(
                f"Model or metadata not found at {MODEL_PATH} and {METADATA_PATH}. "
                "Please run train_model.py first."
            )
            
        with open(MODEL_PATH, "rb") as f:
            self.model = pickle.load(f)
            
        with open(METADATA_PATH, "r", encoding="utf-8") as f:
            self.metadata = json.load(f)
            
        self.is_loaded = True

    def get_metadata(self) -> Dict[str, Any]:
        return self.metadata

    def predict(self, feature_df) -> tuple[float, float]:
        start = time.perf_counter()
        pred = self.model.predict(feature_df)[0]
        elapsed_ms = (time.perf_counter() - start) * 1000
        return float(pred), elapsed_ms
