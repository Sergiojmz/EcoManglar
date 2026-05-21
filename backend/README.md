FastAPI backend for miappvue

Setup (Windows)

1. Create and activate a virtual environment (PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install requirements:

```powershell
pip install -r backend/requirements.txt
```

3. Run the server:

```powershell
uvicorn backend.main:app --reload --port 3000
```

Endpoints (same as Express):
- GET /api/donations
- POST /api/donations
- GET /api/volunteers
- POST /api/volunteers
- GET /api/projects
- GET /api/stats

Notes:
- Data is persisted in `backend.db` (SQLite) in the project root.
- CORS is enabled for all origins so the Vue frontend can call it at `http://localhost:3000`.
