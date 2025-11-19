import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth.js";
import "./Login.css";

export default function Login({ onSubmit, onResult }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirigir si ya hay sesión
  useEffect(() => {
    if (isAuthenticated()) navigate("/", { replace: true });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await onSubmit?.({ email, password });
    setSubmitting(false);
    onResult?.(res?.success, res?.message);
    if (res?.success) navigate("/", { replace: true });
  };

  return (
    <section className="login">
      <form className="login__form" onSubmit={handleSubmit} noValidate>
        <h2 className="login__title">Inicia sesión</h2>
        <div className="login__field">
          <label className="login__label" htmlFor="login-email">
            Correo electrónico
          </label>
          <input
            id="login-email"
            type="email"
            className="login__input"
            placeholder="email@dominio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="login__field">
          <label className="login__label" htmlFor="login-pass">
            Contraseña
          </label>
          <input
            id="login-pass"
            type="password"
            className="login__input"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <button className="login__submit" type="submit" disabled={submitting}>
          {submitting ? "Entrando..." : "Inicia sesión"}
        </button>
        <p className="login__hint">
          ¿Aún no eres miembro? <Link to="/signup">Regístrate aquí</Link>
        </p>
      </form>
    </section>
  );
}
