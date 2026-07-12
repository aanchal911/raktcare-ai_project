# models/

This directory is populated at **build time** by running:

```bash
python ml_model_extractor.py
```

Generated files (not committed to git):
- `raktcare_availability_model.pkl` — XGBoost classifier (F1: 0.7457, AUC: 0.8607)
- `raktcare_frequency_model.pkl`   — XGBoost regressor (R²: 0.5556)
- `raktcare_scaler.pkl`            — StandardScaler for feature normalization
- `raktcare_compat_map.pkl`        — Blood compatibility lookup map
- `raktcare_encoders.pkl`          — Label encoders for categorical features
- `raktcare_model_meta.json`       — Model metadata and performance metrics

On Render, the build command runs `python ml_model_extractor.py` automatically.
