#!/usr/bin/env python3
"""
RaktCare AI - Model Extractor
Extracts trained models from notebook and prepares them for deployment
"""
import pandas as pd
import numpy as np
import joblib
import json
from datetime import datetime, timedelta
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
import xgboost as xgb
import warnings
warnings.filterwarnings("ignore")

# Load and preprocess data (same as notebook)
def prepare_models():
    print("🔄 Loading datasets...")
    registry_df = pd.read_csv("blood_donation_registry_ml_ready.csv")
    compat_df = pd.read_csv("blood_compatibility_lookup.csv")
    
    print("🔄 Preprocessing data...")
    df = registry_df.copy()
    
    # Date processing
    df["last_donation_date"] = pd.to_datetime(df["last_donation_date"], errors="coerce")
    df["as_of_date"] = pd.to_datetime(df["as_of_date"], errors="coerce")
    df["days_since_last"] = (df["as_of_date"] - df["last_donation_date"]).dt.days.fillna(df["recency_days"])
    
    # Feature engineering
    df["donations_per_year"] = df["lifetime_donation_count"] / (df["years_since_first_donation"].replace(0, 1))
    df["eligible_by_gap"] = (df["days_since_last"] >= 90).astype(int)
    df["loyalty_score"] = df["is_regular_donor"] * 0.5 + (df["donation_count_last_12m"] / (df["donation_count_last_12m"].max() + 1)) * 0.5
    df["age_bucket"] = pd.cut(df["age"], bins=[0, 25, 35, 45, 55, 65, 100], labels=["18-25", "26-35", "36-45", "46-55", "56-65", "65+"])
    df["healthy_bmi"] = ((df["bmi"] >= 18.5) & (df["bmi"] <= 30)).astype(int)
    
    # Encode categoricals
    le_sex = LabelEncoder()
    le_region = LabelEncoder()
    le_site = LabelEncoder()
    le_btype = LabelEncoder()
    le_elig = LabelEncoder()
    le_age_b = LabelEncoder()
    
    df["sex_enc"] = le_sex.fit_transform(df["sex"].fillna("Unknown"))
    df["region_enc"] = le_region.fit_transform(df["region"].fillna("Unknown"))
    df["site_enc"] = le_site.fit_transform(df["preferred_site"].fillna("Unknown"))
    df["btype_enc"] = le_btype.fit_transform(df["blood_type"].fillna("Unknown"))
    df["elig_enc"] = le_elig.fit_transform(df["eligibility_status"].fillna("Unknown"))
    df["age_b_enc"] = le_age_b.fit_transform(df["age_bucket"].astype(str))
    
    # Feature list
    FEATURES = [
        "age", "sex_enc", "is_rare_type", "smoker", "bmi", "chronic_condition_flag",
        "eligible_to_donate", "donation_count_last_12m", "is_regular_donor", 
        "years_since_first_donation", "lifetime_donation_count", "recency_days", 
        "days_since_last", "blood_type_country_prevalence", "donation_propensity_score",
        "region_enc", "site_enc", "btype_enc", "elig_enc", "donations_per_year",
        "eligible_by_gap", "loyalty_score", "healthy_bmi", "age_b_enc"
    ]
    
    X = df[FEATURES].fillna(0)
    y_clf = df["donated_next_6m"]
    y_reg = df["next_6m_donation_count"]
    
    # Split data
    X_train, X_test, y_train_clf, y_test_clf = train_test_split(X, y_clf, test_size=0.2, random_state=42, stratify=y_clf)
    _, _, y_train_reg, y_test_reg = train_test_split(X, y_reg, test_size=0.2, random_state=42)
    
    # Train scaler
    scaler = StandardScaler()
    scaler.fit(X_train)
    
    print("🔄 Training XGBoost Availability Model...")
    scale_pos = (y_train_clf == 0).sum() / (y_train_clf == 1).sum()
    xgb_clf = xgb.XGBClassifier(
        n_estimators=300, max_depth=6, learning_rate=0.05,
        subsample=0.8, colsample_bytree=0.8, scale_pos_weight=scale_pos,
        eval_metric="logloss", use_label_encoder=False, random_state=42, n_jobs=-1
    )
    xgb_clf.fit(X_train, y_train_clf, eval_set=[(X_test, y_test_clf)], verbose=False)
    
    print("🔄 Training XGBoost Frequency Model...")
    xgb_reg = xgb.XGBRegressor(
        n_estimators=300, max_depth=5, learning_rate=0.05,
        subsample=0.8, colsample_bytree=0.8, random_state=42, n_jobs=-1
    )
    xgb_reg.fit(X_train, y_train_reg, eval_set=[(X_test, y_test_reg)], verbose=False)
    
    # Build compatibility map
    compat_map = {}
    for _, row in compat_df.iterrows():
        key = (row["donor_blood_type"], row["recipient_blood_type"])
        compat_map[key] = {
            "compatible": bool(row["compatible_for_rbc_transfusion"]),
            "level": row["compatibility_level"]
        }
    
    # Save models
    print("💾 Saving models...")
    joblib.dump(xgb_clf, "models/raktcare_availability_model.pkl")
    joblib.dump(xgb_reg, "models/raktcare_frequency_model.pkl")
    joblib.dump(scaler, "models/raktcare_scaler.pkl")
    joblib.dump(compat_map, "models/raktcare_compat_map.pkl")
    
    # Save encoders
    encoders = {
        "sex": le_sex, "region": le_region, "site": le_site,
        "blood_type": le_btype, "eligibility": le_elig, "age_bucket": le_age_b
    }
    joblib.dump(encoders, "models/raktcare_encoders.pkl")
    
    # Save metadata
    model_meta = {
        "project": "RaktCare AI",
        "version": "1.0.0",
        "trained_on": str(datetime.now().date()),
        "features": FEATURES,
        "blood_groups": ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]
    }
    
    with open("models/raktcare_model_meta.json", "w") as f:
        json.dump(model_meta, f, indent=2)
    
    print("✅ Models extracted and saved to /models directory")
    return model_meta

if __name__ == "__main__":
    import os
    os.makedirs("models", exist_ok=True)
    prepare_models()