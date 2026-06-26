
// useEffect charge les utilisateurs à l’ouverture de la page.
// useState conserve les données et les messages.
import { useEffect, useState } from "react";

// Barre latérale de navigation.
import Sidebar from "../components/Sidebar";

// Outil Axios configuré pour communiquer avec Django.
import api from "../services/api";

// Styles généraux et style particulier de cette page.
import "./DashboardPage.css";
import "./UsersPage.css";


function UsersPage() {
  // Stocke les utilisateurs reçus depuis Django.
  const [users, setUsers] = useState([]);

  // Indique si les données sont encore en chargement.
  const [isLoading, setIsLoading] = useState(true);

  // Stocke un éventuel message d’erreur.
  const [error, setError] = useState("");

  // Charge les utilisateurs lorsque la page s’ouvre.
  useEffect(() => {
    const loadUsers = async () => {
      try {
        // Cette route est accessible uniquement à l’administrateur.
        const response = await api.get("/auth/users/");

        // Accepte une réponse directe ou paginée.
        const userList = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];

        // Enregistre les utilisateurs reçus.
        setUsers(userList);
      } catch (requestError) {
        console.error(requestError);

        setError(
          "Impossible de charger les utilisateurs.",
        );
      } finally {
        // Le chargement est terminé.
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Menu latéral */}
      <Sidebar />

      <main className="dashboard-page">
        {/* En-tête de la page */}
        <header className="dashboard-header">
          <div>
            <h1>Utilisateurs</h1>

            <p>
              Consultez les comptes enregistrés dans
              l’application.
            </p>
          </div>
        </header>

        {/* Contenu principal */}
        <section className="dashboard-content">
          {isLoading && (
            <p>Chargement des utilisateurs...</p>
          )}

          {error && (
            <p className="users-error">{error}</p>
          )}

          {!isLoading &&
            !error &&
            users.length === 0 && (
              <p>Aucun utilisateur enregistré.</p>
            )}

          {/* Tableau des utilisateurs */}
          {!isLoading && users.length > 0 && (
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Nom complet</th>
                    <th>Identifiant</th>
                    <th>Rôle</th>
                    <th>Matricule</th>
                    <th>État</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <strong>
                          {user.first_name ||
                          user.last_name
                            ? `${user.first_name} ${user.last_name}`.trim()
                            : user.username}
                        </strong>
                      </td>

                      <td>{user.username}</td>

                      <td>
                        <span className="user-role">
                          {user.role_display || user.role}
                        </span>
                      </td>

                      <td>
                        {user.matricule ||
                          "Non renseigné"}
                      </td>

                      <td>
                        <span
                          className={
                            user.is_active
                              ? "user-status active"
                              : "user-status inactive"
                          }
                        >
                          {user.is_active
                            ? "Actif"
                            : "Inactif"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default UsersPage;

