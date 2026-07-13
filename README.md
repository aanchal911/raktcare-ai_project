# RaktCare AI

A full-stack intelligent blood donor ecosystem powered by XGBoost ML models, React frontend, FastAPI backend, and Gemini AI assistant.

---

## Project Structure

```
raktcare-ai/
│
├── backend/                          ← Deploy to Render
│   ├── models/                       ← .pkl files generated at build time
│   ├── ml_backend.py                 ← FastAPI server (port 8000)
│   ├── ml_model_extractor.py         ← Trains & saves all ML models
│   ├── requirements.txt              ← Python dependencies
│   ├── runtime.txt                   ← Python 3.11.0
│   ├── render.yaml                   ← Render deployment config
│   ├── blood_compatibility_lookup.csv
│   ├── blood_donation_registry_ml_ready.csv
│   ├── blood_donor_dataset.csv
│   └── .env.example
│
├── src/                              ← React frontend
│   ├── components/
│   │   ├── AnalyticsHub.tsx
│   │   ├── AssistantChat.tsx
│   │   ├── AwarenessHub.tsx
│   │   ├── BloodDrop3D.tsx
│   │   ├── CompatibilityChart.tsx
│   │   ├── DonorHealthPassport.tsx
│   │   ├── DonorSearch.tsx
│   │   ├── EmergencyRegister.tsx
│   │   ├── FamilyVault.tsx
│   │   ├── GamificationHub.tsx
│   │   ├── LandingPage3D.tsx
│   │   ├── NotificationToastContainer.tsx
│   │   ├── PitchDeck.tsx
│   │   ├── PostDonationMonitoring.tsx
│   │   └── ShortageForecasting.tsx
│   ├── data/
│   │   └── donors.ts
│   ├── services/
│   │   └── mlService.ts
│   ├── App.tsx
│   ├── LangContext.tsx               ← EN / HI / GU translations
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
│
├── api/
│   └── chat.ts                       ← Vercel edge function (Gemini AI)
│
├── models/                           ← Local .pkl files (git-ignored)
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── server.ts                         ← Express + Vite dev server
├── tsconfig.json
├── vercel.json                       ← Vercel deployment config
└── vite.config.ts
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
| AI Assistant | Google Gemini API |
| Icons | Lucide React |
| Deployment | Vercel (frontend) + Render (ML backend) |

---

## Quick Start (Local)

```bash
# 1. Install frontend deps
npm install

# 2. Copy env file
cp .env.example .env.local
# Add your GEMINI_API_KEY in .env.local

# 3. Start frontend (Express + Vite)
npm run dev
# → http://localhost:3000

# 4. (Optional) Start ML backend in a separate terminal
cd backend
pip install -r requirements.txt
python ml_model_extractor.py
uvicorn ml_backend:app --host 0.0.0.0 --port 8000 --reload
```

---

## Deployment

### Frontend → Vercel
```bash
npm run build
vercel deploy
```
Set env vars in Vercel dashboard:
- `GEMINI_API_KEY`
- `ML_BACKEND_URL` = your Render URL

### ML Backend → Render
| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `pip install -r requirements.txt && python ml_model_extractor.py` |
| Start Command | `uvicorn ml_backend:app --host 0.0.0.0 --port $PORT` |

---

## ML Models

| Model | Task | Metric |
|---|---|---|
| XGBoost Classifier | Donor availability prediction | F1: 0.7457, AUC: 0.8607 |
| XGBoost Regressor | Donation frequency prediction | R²: 0.5556, MAE: 0.3987 |
| Compatibility Engine | Blood type compatibility lookup | 64-entry rule-based map |
| Shortage Forecaster | 7-day per-blood-group demand | Per-group XGBoost regressors |

---

## Environment Variables

```env
GEMINI_API_KEY="your_gemini_api_key_here"
ML_BACKEND_URL="https://your-render-app.onrender.com"
```

---

MIT License — Every Drop. Every Life.
