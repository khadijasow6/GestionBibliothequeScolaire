// useEffect charge les emprunts à l’ouverture de la page.
// useState conserve les données et les messages.
import { useEffect, useState } from "react";

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

  // État du chargement.
  const [isLoading, setIsLoading] = useState(true);

  // Message d’erreur éventuel.
  const [error, setError] = useState("");

  // Charge les emprunts lorsque la page s’ouvre.
  useEffect(() => {
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

    loadLoans();
  }, []);

  // Retourne une classe CSS différente selon le statut.
  const getStatusClass = (status) => {
    return `loan-status loan-status-${status.toLowerCase()}`;
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
          {isLoading && (
            <p>Chargement des emprunts...</p>
          )}

          {error && (
            <p className="loans-error">{error}</p>
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
                  </tr>
                </thead>

                <tbody>
                  {loans.map((loan) => (
                    <tr key={loan.id}>
                      <td>
                        <strong>{loan.book_title}</strong>
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

export default LoansPage;