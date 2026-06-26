// useEffect charge les utilisateurs à l’ouverture de la page.
// useState conserve les données et les messages.
import { useEffect, useState } from "react";

// Formulaire permettant de créer un élève.
import CreateStudentForm from "../components/CreateStudentForm";

// Barre latérale de navigation.
import Sidebar from "../components/Sidebar";

// Outil Axios configuré pour communiquer avec Django.
import api from "../services/api";

// Styles de la page.
import "./DashboardPage.css";
import "./UsersPage.css";


function UsersPage() {
  // Liste des utilisateurs reçue depuis Django.
  const [users, setUsers] = useState([]);

  // État de chargement de la page.
  const [isLoading, setIsLoading] = useState(true);

  // Messages affichés à l’utilisateur.
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Charge la liste des utilisateurs.
  const loadUsers = async () => {
    try {
      const response = await api.get("/auth/users/");

      // Accepte une réponse directe ou paginée.
      const userList = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      setUsers(userList);
    } catch (requestError) {
      console.error(requestError);

      setError(
        "Impossible de charger la liste des utilisateurs.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Charge les utilisateurs à l’ouverture de la page.
  useEffect(() => {
    loadUsers();
  }, []);

  // Fonction appelée après la création d’un élève.
  const handleStudentCreated = async () => {
    setError("");

    setSuccess(
      "Le nouvel élève a été créé avec succès.",
    );

    // Recharge immédiatement le tableau.
    await loadUsers();
  };

  // Retourne un texte plus lisible pour chaque rôle.
  const getRoleLabel = (role) => {
    if (role === "ELEVE") {
      return "Élève";
    }

    if (role === "BIBLIOTHECAIRE") {
      return "Bibliothécaire";
    }

    if (role === "ADMINISTRATEUR") {
      return "Administrateur";
    }

    return role;
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-page">
        {/* En-tête de la page */}
        <header className="dashboard-header">
          <div>
            <h1>Utilisateurs</h1>

            <p>
              Créez des élèves et consultez les comptes.
            </p>
          </div>
        </header>

        <section className="dashboard-content">
          {/* Formulaire de création d’un élève */}
          <CreateStudentForm
            onStudentCreated={handleStudentCreated}
          />

          {/* Messages de réussite ou d’erreur */}
          {success && (
            <p className="users-success">
              {success}
            </p>
          )}

          {error && (
            <p className="users-error">
              {error}
            </p>
          )}

          {isLoading && (
            <p>Chargement des utilisateurs...</p>
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
                    <th>Nom d’utilisateur</th>
                    <th>Rôle</th>
                    <th>Matricule</th>
                    <th>État</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        {user.first_name || user.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : "Non renseigné"}
                      </td>

                      <td>
                        <strong>{user.username}</strong>
                      </td>

                      <td>
                        <span
                          className={`user-role user-role-${user.role.toLowerCase()}`}
                        >
                          {getRoleLabel(user.role)}
                        </span>
                      </td>

                      <td>
                        {user.matricule || "—"}
                      </td>

                      <td>
                        <span
                          className={
                            user.is_active
                              ? "user-state-active"
                              : "user-state-inactive"
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