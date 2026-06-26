
// useEffect permet d’exécuter du code au chargement de la page.
// useState permet de stocker des données qui peuvent changer.
import { useEffect, useState } from "react";

// Outil configuré pour communiquer avec l’API Django.
import api from "../services/api";

import "./DashboardPage.css";


function DashboardPage() {
  // Récupère l’utilisateur connecté depuis le navigateur.
  const user = JSON.parse(
    localStorage.getItem("user") || "{}",
  );

  // Stocke les statistiques envoyées par Django.
  const [stats, setStats] = useState(null);

  // Stocke un éventuel message d’erreur.
  const [error, setError] = useState("");

  // Indique si les données sont en cours de chargement.
  const [isLoading, setIsLoading] = useState(true);

  // Charge les statistiques lorsque la page s’ouvre.
  useEffect(() => {
    const loadStats = async () => {
      // L’élève n’a pas accès aux statistiques générales.
      if (user.role === "ELEVE") {
        setIsLoading(false);
        return;
      }

      try {
        // Demande les statistiques au backend Django.
        const response = await api.get(
          "/dashboard/stats/",
        );

        // Enregistre les données reçues.
        setStats(response.data);
      } catch (requestError) {
        console.error(requestError);

        setError(
          "Impossible de charger les statistiques.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [user.role]);

  // Déconnecte l’utilisateur.
  const handleLogout = () => {
    // Supprime les informations de connexion.
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // Redirige vers la page de connexion.
    window.location.replace("/login");
  };

  return (
    // Classe principale du tableau de bord.
    <main className="dashboard-page">
      {/* En-tête du tableau de bord */}
      <header className="dashboard-header">
        <div>
          <h1>Tableau de bord</h1>

          <p>
            Bienvenue{" "}
            {user.first_name || user.username}.
          </p>
        </div>

        {/* Bouton de déconnexion */}
        <button
          className="logout-button"
          type="button"
          onClick={handleLogout}
        >
          Se déconnecter
        </button>
      </header>

      {/* Contenu principal */}
      <section className="dashboard-content">
        <h2>
          Rôle : {user.role_display || user.role}
        </h2>

        {/* Contenu différent selon le rôle */}
        {user.role === "ELEVE" ? (
          <p>
            Consultez vos emprunts et leurs dates de
            retour.
          </p>
        ) : (
          <>
            {/* Message pendant le chargement */}
            {isLoading && (
              <p>Chargement des statistiques...</p>
            )}

            {/* Message en cas d’erreur */}
            {error && <p>{error}</p>}

            {/* Affichage des statistiques */}
            {stats && (
              <div className="stats-grid">
                <article className="stat-card">
                  <h3>Livres</h3>
                  <p>{stats.total_books}</p>
                </article>

                <article className="stat-card">
                  <h3>Exemplaires disponibles</h3>
                  <p>{stats.available_copies}</p>
                </article>

                <article className="stat-card">
                  <h3>Emprunts actifs</h3>
                  <p>{stats.active_loans}</p>
                </article>

                <article className="stat-card">
                  <h3>Emprunts en retard</h3>
                  <p>{stats.overdue_loans}</p>
                </article>

                <article className="stat-card">
                  <h3>Élèves</h3>
                  <p>{stats.total_students}</p>
                </article>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default DashboardPage;

