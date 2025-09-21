# Etap 1: build frontend (Vite)
FROM node:18 AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Etap 2: backend (FastAPI)
FROM python:3.11
WORKDIR /app
COPY backend/ ./backend/
# UWAGA: tu zmiana build -> dist
COPY --from=frontend /app/frontend/dist ./frontend/dist
RUN pip install --no-cache-dir -r backend/requirements.txt

# Uruchom FastAPI
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
