import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth.js";
import "./Register.css";

export default function Register({ onSubmit, onResult }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) navigate("/", { replace: true });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const res = (await onSubmit?.({ email, password })) ?? {
      success: false,
      message: "No se pudo procesar el registro",
    };

    onResult?.(res.success, res.message);
    // Opcional: ir al login tras mostrar el tooltip de éxito
    if (res.success) setTimeout(() => navigate("/signin", { replace: true }), 1500);
    setSubmitting(false);
  };

  return (
    <main className="register">
      <h1 className="register__title">Regístrate</h1>
      <form onSubmit={handleSubmit} className="register__form" noValidate>
        <label className="register__field">
          <span className="register__label">Correo electrónico</span>
          <input
            name="email"
            type="email"
            className="register__input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="register__field">
          <span className="register__label">Contraseña</span>
          <input
            name="password"
            type="password"
            className="register__input"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>
        <button type="submit" className="register__submit" disabled={submitting}>
          {submitting ? "Registrando..." : "Regístrate"}
        </button>
      </form>
      <p className="register__hint">
        ¿Ya eres miembro? <Link to="/signin">Inicia sesión aquí</Link>
      </p>
    </main>
  );
}
