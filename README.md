# SESMT Portal Digital — SINAN & CAT (Fullstack MVP)

Este pacote já vem com **frontend (Vite/React/TS)** + **backend (Flask/SQLite/JWT)** para rodar localmente no VS Code.

## 1) Rodar o BACKEND (Flask)
Abra um terminal:
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
pip install -r requirements.txt
python run.py
```
Backend sobe em: `http://localhost:5000/api/health`

**Login padrão (teste):**
- email: `admin@sesmt.local`
- senha: `admin123`

> Troque no arquivo `backend/.env` depois.

## 2) Rodar o FRONTEND (Vite)
Em outro terminal:
```bash
npm install
npm run dev
```
Frontend em: `http://localhost:5173`

## Notas
- O frontend usa `VITE_USE_API=true` por padrão (arquivo `.env.local`).
- Dados ficam no SQLite: `backend/sesmt.db`
