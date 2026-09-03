"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("E-mail ou senha inválidos. Tente novamente.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "var(--bg)",
      }}
    >
      <div className="card" style={{ width: 400, maxWidth: "100%" }}>
        <div style={{ padding: "32px 32px 8px", textAlign: "center" }}>
          <Image
            src="/brand/logo-advance-blue.png"
            alt="Advance Tecnologia"
            width={168}
            height={28}
            style={{ height: 28, width: "auto", margin: "0 auto 20px" }}
            priority
          />
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 4px" }}>
            Entrar no sistema
          </h1>
          <p className="hint" style={{ margin: 0 }}>
            Acesso interno · Advance Tecnologia
          </p>
        </div>

        <form onSubmit={onSubmit} style={{ padding: "20px 32px 32px" }}>
          <div style={{ marginBottom: 16 }}>
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

          <div style={{ marginBottom: 8 }}>
            <label className="form-label" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              className="input"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
