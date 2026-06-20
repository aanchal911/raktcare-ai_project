@echo off
echo ============================================================
echo  RaktCare AI - Starting All Services
echo ============================================================

echo.
echo [1] Starting FastAPI ML Backend on port 8000...
start "RaktCare ML Backend" cmd /k ".venv\Scripts\activate.bat && uvicorn ml_backend:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo [2] Starting Node.js Frontend + Express on port 3000...
start "RaktCare Frontend" cmd /k "npm run dev"

echo.
echo ============================================================
echo  Services starting:
echo    ML Backend  -> http://localhost:8000
echo    ML API Docs -> http://localhost:8000/docs
echo    Frontend    -> http://localhost:3000
echo ============================================================
echo  Close the terminal windows to stop all services.
pause