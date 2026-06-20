@echo off
echo ============================================================
echo  RaktCare AI - Full Stack Setup
echo ============================================================

echo.
echo [1/4] Installing Node.js dependencies...
call npm install
if %errorlevel% neq 0 ( echo ERROR: npm install failed & pause & exit /b 1 )

echo.
echo [2/4] Setting up Python virtual environment...
python -m venv .venv
call .venv\Scripts\activate.bat

echo.
echo [3/4] Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 ( echo ERROR: pip install failed & pause & exit /b 1 )

echo.
echo [4/4] Extracting and training ML models...
python ml_model_extractor.py
if %errorlevel% neq 0 ( echo ERROR: Model extraction failed & pause & exit /b 1 )

echo.
echo ============================================================
echo  Setup complete! Run start_all.bat to launch
echo ============================================================
pause