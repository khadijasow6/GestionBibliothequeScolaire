
// useEffect charge les emprunts à l’ouverture de la page.
// useState conserve les données et les messages.
import { useEffect, useState } from "react";

// Formulaire permettant de créer un nouvel emprunt.
import CreateLoanForm from "../components/CreateLoanForm";

// Barre latérale de navigation.
import Sidebar from "../components/Sidebar";

// Outil Axios configuré pour communiquer avec Django.
import api from "../services/api";

// Styles partagés et styles propres à la page Emprunts.
import "./DashboardPage.css";
import "./LoansPage.css";


function LoansPage() {
  // Liste des emprunts reçue depuis Django.
  const [loans, setLoans] = useState([]);

  // Indique si la liste est en cours de chargement.
  const [isLoading, setIsLoading] = useState(true);

  // Identifiant de l’emprunt dont une action est en cours.
  const [actionLoading, setActionLoading] = useState(null);

  // Permet de recréer le formulaire après un nouvel emprunt.
  const [formKey, setFormKey] = useState(0);

  // Message d’erreur.
  const [error, setError] = useState("");

  // Message de réussite.
  const [success, setSuccess] = useState("");

  // Charge les emprunts depuis Django.
  const loadLoans = async () => {
    try {
      const response = await api.get("/loans/");

      // Accepte une réponse directe ou paginée.
      const loanList = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      setLoans(loanList);
    } catch (requestError) {
      console.error(requestError);

      setError(
        "Impossible de charger la liste des emprunts.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Exécute le chargement à l’ouverture de la page.
  useEffect(() => {
    loadLoans();
  }, []);

  // Cette fonction est appelée après la création d’un emprunt.
  const handleLoanCreated = async () => {
    setError("");

    setSuccess(
      "Le nouvel emprunt a été créé avec succès.",
    );

    // Recharge le tableau des emprunts.
    await loadLoans();

    // Recharge aussi les listes du formulaire.
    setFormKey((currentKey) => currentKey + 1);
  };

  // Retourne une classe CSS différente selon le statut.
  const getStatusClass = (status) => {
    return `loan-status loan-status-${status.toLowerCase()}`;
  };

  // Enregistre le retour d’un livre.
  const handleReturn = async (loanId) => {
    setError("");
    setSuccess("");
    setActionLoading(loanId);

    try {
      await api.post(`/loans/${loanId}/return/`);

      setSuccess(
        "Le retour du livre a été enregistré.",
      );

      // Recharge la liste pour afficher le nouveau statut.
      await loadLoans();

      // Recharge les exemplaires disponibles du formulaire.
      setFormKey((currentKey) => currentKey + 1);
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.detail ||
          "Impossible d’enregistrer le retour.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Déclare un livre comme perdu.
  const handleMarkLost = async (loanId) => {
    // Demande une confirmation avant l’action.
    const confirmed = window.confirm(
      "Voulez-vous vraiment déclarer ce livre perdu ?",
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");
    setActionLoading(loanId);

    try {
      await api.post(`/loans/${loanId}/mark-lost/`);

      setSuccess(
        "Le livre a été déclaré perdu.",
      );

      // Recharge la liste pour afficher le nouveau statut.
      await loadLoans();

      // Recharge aussi le formulaire.
      setFormKey((currentKey) => currentKey + 1);
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.detail ||
          "Impossible de déclarer ce livre perdu.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-page">
        {/* En-tête de la page */}
        <header className="dashboard-header">
          <div>
            <h1>Emprunts</h1>

            <p>
              Consultez et gérez les emprunts de la
              bibliothèque.
            </p>
          </div>
        </header>

        {/* Contenu principal */}
        <section className="dashboard-content">
          {/* Formulaire de création d’un emprunt */}
          <CreateLoanForm
            key={formKey}
            onLoanCreated={handleLoanCreated}
          />

          {/* Messages affichés sous le formulaire */}
          {error && (
            <p className="loans-error">{error}</p>
          )}

          {success && (
            <p className="loans-success">{success}</p>
          )}

          {isLoading && (
            <p>Chargement des emprunts...</p>
          )}

          {!isLoading &&
            !error &&
            loans.length === 0 && (
              <p>Aucun emprunt enregistré.</p>
            )}

          {/* Tableau des emprunts */}
          {!isLoading && loans.length > 0 && (
            <div className="loans-table-container">
              <table className="loans-table">
                <thead>
                  <tr>
                    <th>Livre</th>
                    <th>Élève</th>
                    <th>Exemplaire</th>
                    <th>Date limite</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loans.map((loan) => {
                    // Les actions sont possibles uniquement
                    // pour les emprunts actifs ou en retard.
                    const canManage =
                      loan.status === "EN_COURS" ||
                      loan.status === "EN_RETARD";

                    return (
                      <tr key={loan.id}>
                        <td>
                          <strong>
                            {loan.book_title}
                          </strong>
                        </td>

                        <td>{loan.student_name}</td>

                        <td>{loan.inventory_code}</td>

                        <td>
                          {new Date(
                            loan.due_at,
                          ).toLocaleDateString("fr-FR")}
                        </td>

                        <td>
                          <span
                            className={getStatusClass(
                              loan.status,
                            )}
                          >
                            {loan.status_display}
                          </span>
                        </td>

                        <td>
                          {canManage ? (
                            <div className="loan-actions">
                              <button
                                className="return-button"
                                type="button"
                                disabled={
                                  actionLoading === loan.id
                                }
                                onClick={() => {
                                  handleReturn(loan.id);
                                }}
                              >
                                Retourner
                              </button>

                              <button
                                className="lost-button"
                                type="button"
                                disabled={
                                  actionLoading === loan.id
                                }
                                onClick={() => {
                                  handleMarkLost(loan.id);
                                }}
                              >
                                Déclarer perdu
                              </button>
                            </div>
                          ) : (
                            <span className="no-action">
                              Aucune action
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default LoansPage;

