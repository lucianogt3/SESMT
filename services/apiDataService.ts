import { Notificacao, AppSettings } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getToken(): string | null {
  return localStorage.getItem("sesmt_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json();
}

export const apiDataService = {
  async login(email: string, senha: string) {
    const data = await request<{access_token: string; user: {email: string; role: string}}>(`/api/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    });
    localStorage.setItem("sesmt_token", data.access_token);
    localStorage.setItem("sesmt_user", JSON.stringify(data.user));
    return data.user;
  },
  logout() {
    localStorage.removeItem("sesmt_token");
    localStorage.removeItem("sesmt_user");
  },
  getUser(): {email: string; role: string} | null {
    const raw = localStorage.getItem("sesmt_user");
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },
  async getSettings(): Promise<AppSettings> {
    return request<AppSettings>(`/api/settings`);
  },
  async updateSettings(settings: AppSettings): Promise<void> {
    await request(`/api/settings`, { method: "PUT", body: JSON.stringify(settings) });
  },
  async getNotificacoes(): Promise<Notificacao[]> {
    return request<Notificacao[]>(`/api/notificacoes`);
  },
  async saveNotificacao(payload: any): Promise<Notificacao> {
    return request<Notificacao>(`/api/notificacoes`, { method: "POST", body: JSON.stringify(payload) });
  },
  async search(cpf: string, data: string): Promise<Notificacao[]> {
    return request<Notificacao[]>(`/api/notificacoes/search`, { method: "POST", body: JSON.stringify({ cpf, data }) });
  },
  async getDaysWithoutAccidents(): Promise<number> {
    return request<number>(`/api/indicadores/dias-sem-acidente`);
  }
};
