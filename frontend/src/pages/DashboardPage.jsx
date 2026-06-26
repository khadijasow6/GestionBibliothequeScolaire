
// useEffect exécute du code au chargement de la page.
// useState stocke des données qui peuvent changer.
import { useEffect, useState } from "react";

// Barre latérale contenant les liens de navigation.
import Sidebar from "../components/Sidebar";

// Outil permettant de communiquer avec Django.
import api from "../services/api";

// Style du tableau de bord.
import "./DashboardPage.css";


function DashboardPage() {
  // Récupère les informations de l’utilisateur connecté.
  const user = JSON.parse(
    localStorage.getItem("user") || "{}",
  );

  // Stocke les statistiques envoyées par Django.
  const [stats, setStats] = useState(null);

  // Stocke un éventuel message d’erreur.
  const [error, setError] = useState("");

  // Indique si les données sont encore en chargement.
  const [isLoading, setIsLoading] = useState(true);

  // Charge les statistiques au démarrage de la page.
  useEffect(() => {
    const loadStats = async () => {
      // Les élèves n’ont pas accès aux statistiques générales.
      if (user.role === "ELEVE") {
        setIsLoading(false);
        return;
      }

      try {
        // Envoie une requête au backend Django.
        const response = await api.get(
          "/dashboard/stats/",
        );

        // Enregistre les statistiques reçues.
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
    // Supprime les informations enregistrées dans le navigateur.
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // Redirige vers la page de connexion.
    window.location.replace("/login");
  };

  return (
    // Contient la barre latérale et le tableau de bord.
    <div className="dashboard-layout">
      <Sidebar />

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

          {user.role === "ELEVE" ? (
            <p>
              Consultez vos emprunts et leurs dates de
              retour.
            </p>
          ) : (
            <>
              {isLoading && (
                <p>Chargement des statistiques...</p>
              )}

              {error && <p>{error}</p>}

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
    </div>
  );
}

export default DashboardPage;

