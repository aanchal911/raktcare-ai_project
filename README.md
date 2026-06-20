# RaktCare AI

A full-stack intelligent blood donor ecosystem powered by XGBoost ML models, React frontend, FastAPI backend, and Gemini AI assistant.

---

## Project Overview

RaktCare AI predicts donor availability, ranks donors for emergency SOS broadcasts, checks blood compatibility, and forecasts blood shortages — all driven by trained machine learning models served through a REST API.

### Core Features

- **Donor Availability Prediction** — XGBoost classifier predicts whether a donor will donate in the next 6 months (F1: 0.7457, AUC: 0.8607)
- **Donation Frequency Regression** — XGBoost regressor predicts how many times a donor will donate (R²: 0.5556)
- **Blood Shortage Forecasting** — Per-blood-group 7-day demand forecasting
- **Blood Compatibility Engine** — Rule-based 64-entry lookup for RBC transfusion compatibility
- **Donor Ranking (RaktScore)** — Composite 4-factor ranking for real-time SOS broadcast
- **Gemini AI Assistant** — Conversational AI for blood donation guidance
- **Emergency SOS Registry** — Real-time emergency request tracking with push notifications
- **Family Emergency Vault** — Store and manage family blood group profiles
- **3D Landing Page** — Immersive entry experience

---

## Project Structure

```
raktcare-ai/
├── src/
│   ├── components/
│   │   ├── AnalyticsHub.tsx        # ML model stats + charts dashboard
│   │   ├── AssistantChat.tsx       # Gemini AI chat interface
│   │   ├── AwarenessHub.tsx        # Blood donation awareness content
│   │   ├── BloodDrop3D.tsx         # 3D animated blood drop component
│   │   ├── CompatibilityChart.tsx  # Interactive compatibility graph
│   │   ├── DonorSearch.tsx         # ML-powered donor finder
│   │   ├── EmergencyRegister.tsx   # SOS emergency request management
│   │   ├── FamilyVault.tsx         # Family blood profile vault
│   │   ├── LandingPage3D.tsx       # 3D gate landing experience
│   │   ├── NotificationToastContainer.tsx
│   │   └── PitchDeck.tsx
│   ├── data/
│   │   └── donors.ts               # Static donor seed data
│   ├── services/
│   │   └── mlService.ts            # ML API client with fallback logic
│   ├── App.tsx                     # Root app with tab navigation
│   ├── types.ts                    # Shared TypeScript types
│   ├── main.tsx
│   └── index.css
├── models/                         # Trained .pkl model files (generated)
│   ├── raktcare_availability_model.pkl
│   ├── raktcare_frequency_model.pkl
│   ├── raktcare_scaler.pkl
│   ├── raktcare_compat_map.pkl
│   ├── raktcare_encoders.pkl
│   └── raktcare_model_meta.json
├── api/
│   └── chat.ts                     # Vercel edge chat route
├── ml_backend.py                   # FastAPI ML server (port 8000)
├── ml_model_extractor.py           # Trains + saves models from CSV data
├── server.ts                       # Express server + Vite middleware + ML proxy
├── requirements.txt                # Python dependencies
├── package.json                    # Node.js dependencies
├── setup.bat                       # One-click full setup script
├── start_all.bat                   # Starts all services together
├── blood_donation_registry_ml_ready.csv   # 30,000-row ML training data
├── blood_donor_dataset.csv                # 10,000-row donor data
├── blood_compatibility_lookup.csv         # 64-row compatibility table
├── Untitled0.ipynb                        # Original ML notebook
├── vite.config.ts
├── tsconfig.json
├── vercel.json
└── .env.example
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS v4, Vite |
| Animations | Motion (Framer Motion) |
| Backend (Node) | Express.js, tsx |
| Backend (ML) | FastAPI, Uvicorn |
| ML Models | XGBoost, scikit-learn, pandas, numpy |
| AI Assistant | Google Gemini API (`@google/genai`) |
| Icons | Lucide React |
| Deployment | Vercel (frontend), any Python host (backend) |

---

## Prerequisites

- **Node.js** v18 or higher
- **Python** 3.9 or higher
- **pip** (comes with Python)
- A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com)

---

## Quick Start

### Option 1 — Automated (Windows)

```bash
# Step 1: One-time setup (installs all deps + trains models)
setup.bat

# Step 2: Start everything
start_all.bat
```

### Option 2 — Manual

**1. Install Node dependencies**
```bash
npm install
```

**2. Set up Python environment**
```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate
```

**3. Install Python dependencies**
```bash
pip install -r requirements.txt
```

**4. Train and save ML models**
```bash
python ml_model_extractor.py
```

**5. Configure environment**
```bash
cp .env.example .env.local
# Edit .env.local and set your GEMINI_API_KEY
```

**6. Start the ML backend**
```bash
uvicorn ml_backend:app --host 0.0.0.0 --port 8000 --reload
```

**7. Start the frontend (new terminal)**
```bash
npm run dev
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
GEMINI_API_KEY="your_gemini_api_key_here"
ML_BACKEND_URL="http://localhost:8000"
APP_URL="http://localhost:3000"
```

---

## ML API Endpoints

The FastAPI backend runs on `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/model-info` | Model version, features, metrics |
| POST | `/predict/availability` | Donor availability probability + score |
| POST | `/predict/compatibility` | Blood type compatibility check |
| POST | `/predict/ranking` | Rank donor pool by RaktScore |
| GET | `/compatible-donors/{type}` | All compatible donor types for a recipient |

### Example: Predict Donor Availability

```bash
curl -X POST http://localhost:8000/predict/availability \
  -H "Content-Type: application/json" \
  -d '{
    "age": 32,
    "sex": "Male",
    "blood_type": "O+",
    "region": "Gujarat",
    "eligible_to_donate": 1,
    "donation_count_last_12m": 2,
    "is_regular_donor": 1,
    "recency_days": 120,
    "bmi": 23.5,
    "lifetime_donation_count": 8,
    "years_since_first_donation": 4.0,
    "donation_propensity_score": 0.75
  }'
```

Response:
```json
{
  "availability_probability": 0.8341,
  "frequency_prediction": 1.72,
  "donor_score": 0.7863
}
```

### Example: Check Compatibility

```bash
curl -X POST http://localhost:8000/predict/compatibility \
  -H "Content-Type: application/json" \
  -d '{"donor_blood_type": "O-", "recipient_blood_type": "AB+"}'
```

Response:
```json
{
  "compatible": true,
  "level": "acceptable",
  "donor_type": "O-",
  "recipient_type": "AB+"
}
```

---

## ML Models

### Model 1 — Donor Availability (XGBoost Classifier)
- **Task:** Predict if a donor will donate in the next 6 months
- **Features:** 24 (age, BMI, recency, loyalty score, eligibility, region, blood type, etc.)
- **Accuracy:** 0.819 | **F1:** 0.7457 | **ROC-AUC:** 0.8607

### Model 2 — Donation Frequency (XGBoost Regressor)
- **Task:** Predict how many times a donor will donate in next 6 months
- **MAE:** 0.3987 | **RMSE:** 0.5595 | **R²:** 0.5556

### Model 3 — Blood Shortage Forecasting
- **Task:** 7-day demand forecast per blood group
- **Method:** Per-blood-group XGBoost regressors with lag features

### Compatibility Engine
- Rule-based lookup from `blood_compatibility_lookup.csv` (64 donor×recipient pairs)
- Levels: `ideal`, `acceptable`, `incompatible`

### RaktScore (Donor Ranking)
Composite score used for SOS broadcast donor ranking:

```
RaktScore = 0.40 × availability_prob
          + 0.25 × compat_score
          + 0.20 × eligibility_score
          + 0.15 × recency_score
```

---

## Frontend ML Integration

The `mlService.ts` in `src/services/` provides a typed API client that:
- Calls all ML endpoints via the Express proxy at `/api/ml/*`
- Automatically falls back to heuristic scoring if the Python backend is offline
- Converts frontend donor objects to the ML feature format

```ts
import { mlService } from './services/mlService';

// Predict availability
const result = await mlService.predictAvailability(donorInput);
console.log(result.availability_probability); // 0.83

// Check compatibility
const compat = await mlService.checkCompatibility('O-', 'AB+');
console.log(compat.compatible); // true

// Get compatible donors
const donors = await mlService.getCompatibleDonors('A+');
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Express + Vite dev server on port 3000 |
| `npm run build` | Build frontend + bundle server for production |
| `npm run start` | Run production build |
| `npm run lint` | TypeScript type check |
| `python ml_model_extractor.py` | Train and save all ML models |
| `uvicorn ml_backend:app --reload` | Start ML API server on port 8000 |
| `setup.bat` | Full one-click setup (Windows) |
| `start_all.bat` | Start all services (Windows) |

---

## Deployment

### Frontend + Express (Vercel)
The project includes `vercel.json`. Deploy with:
```bash
npm run build
vercel deploy
```
Set environment variables in the Vercel dashboard.

### ML Backend (Python)
Deploy `ml_backend.py` to any Python-capable host:
- **Railway** — Connect GitHub repo, set start command to `uvicorn ml_backend:app --host 0.0.0.0 --port $PORT`
- **Render** — Use `uvicorn ml_backend:app --host 0.0.0.0 --port 10000`
- **Google Cloud Run** — Containerize with the Dockerfile below

Set `ML_BACKEND_URL` in your frontend environment to point to the deployed backend URL.

### Docker (ML Backend)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY ml_backend.py ml_model_extractor.py *.csv ./
RUN python ml_model_extractor.py
EXPOSE 8000
CMD ["uvicorn", "ml_backend:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## Architecture

```
Browser
  │
  ▼
React (Vite) ──► Express Server (port 3000)
                      │
                      ├── /api/chat        ──► Google Gemini API
                      │
                      └── /api/ml/*  ──────► FastAPI ML Backend (port 8000)
                                                  │
                                                  ├── XGBoost Classifier (availability)
                                                  ├── XGBoost Regressor (frequency)
                                                  ├── Compatibility Map (pkl)
                                                  └── Encoder / Scaler (pkl)
```

---

## Data

| File | Rows | Description |
|---|---|---|
| `blood_donation_registry_ml_ready.csv` | 30,000 | ML-ready donor registry (27 features) |
| `blood_donor_dataset.csv` | 10,000 | Raw donor profiles (12 features) |
| `blood_compatibility_lookup.csv` | 64 | Blood type compatibility table |

---

## License

MIT License — Every Drop. Every Life.
