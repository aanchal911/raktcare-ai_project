#!/usr/bin/env python3
"""
RaktCare AI - FastAPI Backend
Serves ML models for donor availability, frequency, and compatibility predictions
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Union
import joblib
import pandas as pd
import numpy as np
import json
import logging
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(title="RaktCare AI API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model storage
models = {}

# Pydantic models
class DonorInput(BaseModel):
    age: int
    sex: str = "Male"
    blood_type: str
    region: str = "Gujarat"
    is_rare_type: int = 0
    smoker: int = 0
    bmi: float = 23.0
    chronic_condition_flag: int = 0
    eligible_to_donate: int = 1
    donation_count_last_12m: int = 2
    is_regular_donor: int = 1
    years_since_first_donation: float = 2.0
    lifetime_donation_count: int = 5
    recency_days: int = 90
    blood_type_country_prevalence: float = 0.37
    donation_propensity_score: float = 0.7
    preferred_site: str = "Regional Blood Bank"
    eligibility_status: str = "Eligible"

class CompatibilityInput(BaseModel):
    donor_blood_type: str
    recipient_blood_type: str

class RankingInput(BaseModel):
    recipient_blood_type: str
    donors: List[DonorInput]
    top_n: int = 10

class PredictionResponse(BaseModel):
    availability_probability: float
    frequency_prediction: float
    donor_score: float

class CompatibilityResponse(BaseModel):
    compatible: bool
    level: str
    donor_type: str
    recipient_type: str

class RankingResponse(BaseModel):
    rank: int
    donor_id: str
    availability_prob: float
    compat_score: float
    rakt_score: float

def load_models():
    """Load all trained models and artifacts"""
    try:
        models["availability"] = joblib.load("models/raktcare_availability_model.pkl")
        models["frequency"] = joblib.load("models/raktcare_frequency_model.pkl")
        models["scaler"] = joblib.load("models/raktcare_scaler.pkl")
        models["compat_map"] = joblib.load("models/raktcare_compat_map.pkl")
        models["encoders"] = joblib.load("models/raktcare_encoders.pkl")
        
        with open("models/raktcare_model_meta.json", "r") as f:
            models["meta"] = json.load(f)
        
        logger.info("✅ All models loaded successfully")
        return True
    except Exception as e:
        logger.error(f"❌ Error loading models: {str(e)}")
        return False

def encode_donor_features(donor: DonorInput) -> np.ndarray:
    """Convert donor input to model features"""
    try:
        encoders = models["encoders"]
        
        # Handle categorical encoding with fallback
        def safe_encode(encoder, value, default=0):
            try:
                return encoder.transform([value])[0]
            except:
                return default
        
        # Create age bucket
        age_bucket = "26-35" if 26 <= donor.age <= 35 else "18-25" if donor.age < 26 else "36-45"
        
        # Create feature vector
        features = [
            donor.age,
            safe_encode(encoders["sex"], donor.sex),
            donor.is_rare_type,
            donor.smoker,
            donor.bmi,
            donor.chronic_condition_flag,
            donor.eligible_to_donate,
            donor.donation_count_last_12m,
            donor.is_regular_donor,
            donor.years_since_first_donation,
            donor.lifetime_donation_count,
            donor.recency_days,
            donor.recency_days,  # days_since_last (same as recency for this demo)
            donor.blood_type_country_prevalence,
            donor.donation_propensity_score,
            safe_encode(encoders["region"], donor.region),
            safe_encode(encoders["site"], donor.preferred_site),
            safe_encode(encoders["blood_type"], donor.blood_type),
            safe_encode(encoders["eligibility"], donor.eligibility_status),
            donor.lifetime_donation_count / max(donor.years_since_first_donation, 1),  # donations_per_year
            1 if donor.recency_days >= 90 else 0,  # eligible_by_gap
            donor.is_regular_donor * 0.5 + (donor.donation_count_last_12m / 13) * 0.5,  # loyalty_score
            1 if 18.5 <= donor.bmi <= 30 else 0,  # healthy_bmi
            safe_encode(encoders["age_bucket"], age_bucket)
        ]
        
        return np.array(features).reshape(1, -1)
    
    except Exception as e:
        logger.error(f"Error encoding features: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Feature encoding error: {str(e)}")

@app.on_event("startup")
async def startup_event():
    """Load models on startup"""
    success = load_models()
    if not success:
        logger.error("Failed to load models - some endpoints may not work")

@app.get("/")
async def root():
    return {"message": "RaktCare AI Backend API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "models_loaded": len(models) > 0,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/predict/availability", response_model=PredictionResponse)
async def predict_availability(donor: DonorInput):
    """Predict donor availability probability"""
    try:
        if "availability" not in models:
            raise HTTPException(status_code=503, detail="Model not loaded")
        
        features = encode_donor_features(donor)
        
        # Predictions
        availability_prob = models["availability"].predict_proba(features)[0, 1]
        frequency_pred = models["frequency"].predict(features)[0]
        
        # Calculate composite donor score
        donor_score = (
            0.4 * availability_prob +
            0.3 * min(frequency_pred / 3, 1.0) +
            0.2 * donor.eligible_to_donate +
            0.1 * (1.0 if donor.recency_days >= 90 else 0.5)
        )
        
        return PredictionResponse(
            availability_probability=round(float(availability_prob), 4),
            frequency_prediction=round(float(frequency_pred), 2),
            donor_score=round(float(donor_score), 4)
        )
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict/compatibility", response_model=CompatibilityResponse)
async def check_compatibility(compat: CompatibilityInput):
    """Check blood type compatibility"""
    try:
        if "compat_map" not in models:
            raise HTTPException(status_code=503, detail="Compatibility map not loaded")
        
        key = (compat.donor_blood_type, compat.recipient_blood_type)
        compat_info = models["compat_map"].get(key)
        
        if not compat_info:
            return CompatibilityResponse(
                compatible=False,
                level="unknown",
                donor_type=compat.donor_blood_type,
                recipient_type=compat.recipient_blood_type
            )
        
        return CompatibilityResponse(
            compatible=compat_info["compatible"],
            level=compat_info["level"],
            donor_type=compat.donor_blood_type,
            recipient_type=compat.recipient_blood_type
        )
        
    except Exception as e:
        logger.error(f"Compatibility error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict/ranking", response_model=List[RankingResponse])
async def rank_donors(ranking: RankingInput):
    """Rank donors for emergency SOS"""
    try:
        if not models.get("availability") or not models.get("compat_map"):
            raise HTTPException(status_code=503, detail="Required models not loaded")
        
        results = []
        
        for i, donor in enumerate(ranking.donors):
            # Check compatibility first
            compat_key = (donor.blood_type, ranking.recipient_blood_type)
            compat_info = models["compat_map"].get(compat_key, {"compatible": False, "level": "incompatible"})
            
            if not compat_info["compatible"]:
                continue
            
            # Get availability prediction
            features = encode_donor_features(donor)
            availability_prob = models["availability"].predict_proba(features)[0, 1]
            
            # Calculate compatibility score
            compat_score = 1.0 if compat_info["level"] == "ideal" else 0.7
            
            # Calculate composite RaktScore
            eligibility_score = float(donor.eligible_to_donate)
            recency_score = min(donor.recency_days / 365, 1.0)
            
            rakt_score = (
                0.40 * availability_prob +
                0.25 * compat_score +
                0.20 * eligibility_score +
                0.15 * recency_score
            )
            
            results.append(RankingResponse(
                rank=0,  # Will be set after sorting
                donor_id=f"donor_{i+1}",
                availability_prob=round(float(availability_prob), 4),
                compat_score=round(float(compat_score), 2),
                rakt_score=round(float(rakt_score), 4)
            ))
        
        # Sort by rakt_score and assign ranks
        results.sort(key=lambda x: x.rakt_score, reverse=True)
        for i, result in enumerate(results[:ranking.top_n]):
            result.rank = i + 1
        
        return results[:ranking.top_n]
        
    except Exception as e:
        logger.error(f"Ranking error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/compatible-donors/{recipient_type}")
async def get_compatible_donors(recipient_type: str):
    """Get all compatible donor types for a recipient"""
    try:
        if "compat_map" not in models:
            raise HTTPException(status_code=503, detail="Compatibility map not loaded")
        
        compatible = []
        for (donor, recipient), info in models["compat_map"].items():
            if recipient == recipient_type and info["compatible"]:
                compatible.append({
                    "donor_type": donor,
                    "level": info["level"]
                })
        
        # Sort by compatibility level (ideal first)
        compatible.sort(key=lambda x: (x["level"] != "ideal", x["level"]))
        
        return compatible
        
    except Exception as e:
        logger.error(f"Compatible donors error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/model-info")
async def get_model_info():
    """Get model metadata and information"""
    try:
        if "meta" not in models:
            return {"error": "Model metadata not available"}
        
        info = models["meta"].copy()
        info["models_loaded"] = list(models.keys())
        info["api_status"] = "active"
        
        return info
        
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)