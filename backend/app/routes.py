import json
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from . import db
from .models import User, Settings, Notificacao

api_bp = Blueprint("api", __name__)

def _get_settings():
    s = Settings.query.first()
    if not s:
        # defaults matching frontend expectation
        s = Settings(
            setores=json.dumps(["UTI", "Centro Cirúrgico", "Enfermaria", "Emergência"]),
            partesCorpo=json.dumps(["Mãos", "Olhos", "Face", "Tronco", "Membro Superior", "Membro Inferior"]),
            locais=json.dumps(["Instalações do contratante", "Via pública", "Ambulância", "Outro"]),
        )
        db.session.add(s)
        db.session.commit()
    return s

@api_bp.get("/health")
def health():
    return jsonify({"status": "ok", "ts": datetime.utcnow().isoformat()})

@api_bp.post("/auth/login")
def login():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip().lower()
    senha = payload.get("senha") or ""
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(senha):
        return jsonify({"error": "Login inválido"}), 401
    token = create_access_token(identity={"id": user.id, "email": user.email, "role": user.role},
                                expires_delta=timedelta(hours=12))
    return jsonify({"access_token": token, "user": {"email": user.email, "role": user.role}})

@api_bp.get("/settings")
def get_settings():
    s = _get_settings()
    return jsonify({
        "setores": json.loads(s.setores),
        "partesCorpo": json.loads(s.partesCorpo),
        "locais": json.loads(s.locais),
    })

@api_bp.put("/settings")
@jwt_required()
def put_settings():
    payload = request.get_json(silent=True) or {}
    s = _get_settings()
    s.setores = json.dumps(payload.get("setores", []))
    s.partesCorpo = json.dumps(payload.get("partesCorpo", []))
    s.locais = json.dumps(payload.get("locais", []))
    db.session.commit()
    return jsonify({"ok": True})

@api_bp.get("/notificacoes")
@jwt_required(optional=True)  # allow public read? keep optional for now
def list_notificacoes():
    rows = Notificacao.query.order_by(Notificacao.id.desc()).all()
    items = []
    for r in rows:
        try:
            items.append(json.loads(r.data))
        except Exception:
            continue
    return jsonify(items)

@api_bp.post("/notificacoes")
def create_notificacao():
    payload = request.get_json(silent=True) or {}
    # Server-side ensure fields
    payload.setdefault("status", "aberto")
    payload.setdefault("dataRegistro", datetime.utcnow().date().isoformat())
    # id is auto
    rec = Notificacao(data=json.dumps(payload, ensure_ascii=False))
    db.session.add(rec)
    db.session.commit()
    # embed id back
    payload["id"] = str(rec.id)
    rec.data = json.dumps(payload, ensure_ascii=False)
    db.session.commit()
    return jsonify(payload), 201

@api_bp.post("/notificacoes/search")
def search_notificacoes():
    payload = request.get_json(silent=True) or {}
    cpf = (payload.get("cpf") or "").strip()
    data = (payload.get("data") or "").strip()
    # naive search by scanning JSON (OK for MVP/SQLite). Production: indexed columns.
    rows = Notificacao.query.order_by(Notificacao.id.desc()).all()
    out = []
    for r in rows:
        try:
            j = json.loads(r.data)
        except Exception:
            continue
        col = (j.get("colaborador") or {})
        if (col.get("cpf") or "") == cpf:
            # accept either nascimento or acidente match, as frontend suggests
            if (col.get("dataNascimento") or "") == data or (j.get("dataAcidente") or "") == data:
                out.append(j)
    return jsonify(out)

@api_bp.get("/indicadores/dias-sem-acidente")
def dias_sem_acidente():
    # Compute from notificacoes with afastamento? If absent, use latest acidente date.
    rows = Notificacao.query.order_by(Notificacao.id.desc()).all()
    dates = []
    for r in rows:
        try:
            j = json.loads(r.data)
            da = j.get("dataAcidente")
            if da:
                dates.append(da)
        except Exception:
            pass
    if not dates:
        return jsonify(0)
    # latest date
    latest = max(dates)
    try:
        latest_dt = datetime.fromisoformat(latest)
    except Exception:
        return jsonify(0)
    diff = (datetime.utcnow() - latest_dt).days
    return jsonify(max(diff, 0))
