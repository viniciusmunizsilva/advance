"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AuthCard } from "@/components/auth/AuthCard";

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/redefinir-senha`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setLoading(false);
    if (error) {
      setError("Não foi possível enviar o e-mail. Tente novamente.");
      return;
    }
    setSent(true);
  }

  return (
    <AuthCard
      title="Recuperar senha"
      subtitle="Enviaremos um link para redefinir sua senha"
      footer={<Link href="/login">Voltar para o login</Link>}
    >
      {sent ? (
        <p style={{ fontSize: 13.5, color: "var(--text-secondary)", margin: 0 }}>
          Se existir uma conta para <strong>{email}</strong>, enviamos um link de
          redefinição. Verifique sua caixa de entrada.
        </p>
      ) : (
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 8 }}>
            <label className="form-label" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              className="input"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && (
            <p className="form-error" role="alert" style={{ marginBottom: 12 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: 12 }}
          >
            {loading ? "Enviando…" : "Enviar link"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
