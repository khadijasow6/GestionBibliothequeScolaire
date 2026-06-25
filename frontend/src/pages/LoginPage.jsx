
import { useState } from "react";

import api from "../services/api";
import "./LoginPage.css";


function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login/", {
        username,
        password,
      });

      localStorage.setItem(
        "accessToken",
        response.data.access,
      );

      localStorage.setItem(
        "refreshToken",
        response.data.refresh,
      );

      const userResponse = await api.get("/auth/me/");

      localStorage.setItem(
        "user",
        JSON.stringify(userResponse.data),
      );

      window.location.replace("/dashboard");
    } catch (requestError) {
      console.error(requestError);

      setError(
        "Nom d’utilisateur ou mot de passe incorrect.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <section className="login-brand">
          <div className="login-logo">
            BS
          </div>

          <h1>Bibliothèque scolaire</h1>

          <p>
            Gérez facilement les livres, les emprunts
            et les utilisateurs de votre établissement.
          </p>
        </section>

        <section className="login-content">
          <div className="login-heading">
            <h2>Connexion</h2>

            <p>
              Accédez à votre espace personnel
            </p>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="username">
                Nom d’utilisateur
              </label>

              <input
                id="username"
                type="text"
                value={username}
                placeholder="Entrez votre identifiant"
                autoComplete="username"
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Mot de passe
              </label>

              <input
                id="password"
                type="password"
                value={password}
                placeholder="Entrez votre mot de passe"
                autoComplete="current-password"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                required
              />
            </div>

            {error && (
              <p className="login-error">
                {error}
              </p>
            )}

            <button
              className="login-button"
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? "Connexion en cours..."
                : "Se connecter"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;

