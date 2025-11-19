export const isAuthenticated = () => !!localStorage.getItem("jwt");
export const getToken = () => localStorage.getItem("jwt");
export const login = (t) => localStorage.setItem("jwt", t);
export const logout = () => localStorage.removeItem("jwt");

const BASE = import.meta.env.VITE_AUTH_BASE_URL || "https://se-register-api.en.tripleten-services.com/v1";

async function req(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  const text = await res.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }
  if (!res.ok) throw new Error(data?.message || `Auth error ${res.status}`);
  return data;
}

export async function authorize({ email, password }) {
  const { token } = await req("/signin", {
    method: "POST",
    body: JSON.stringify({ email: email.trim(), password }),
  });
  return token;
}

export async function register({ email, password }) {
  return req("/signup", {
    method: "POST",
    body: JSON.stringify({ email: email.trim(), password }),
  });
}

export async function verifyToken(token) {
  const res = await fetch(`${BASE}/users/me`, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Token inválido");
  return res.json();
}
