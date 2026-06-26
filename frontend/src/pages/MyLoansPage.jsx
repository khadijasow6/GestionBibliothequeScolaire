
// useEffect charge les emprunts à l’ouverture de la page.
// useState conserve les données et les messages.
import { useEffect, useState } from "react";

// Barre latérale de navigation.
import Sidebar from "../components/Sidebar";

// Outil Axios configuré pour communiquer avec Django.
import api from "../services/api";

// Styles partagés et styles du tableau des emprunts.
import "./DashboardPage.css";
import "./LoansPage.css";


function MyLoansPage() {
  // Stocke uniquement les emprunts de l’élève connecté.
  const [loans, setLoans] = useState([]);

  // Indique si les données sont encore en chargement.
  const [isLoading, setIsLoading] = useState(true);

  // Stocke un éventuel message d’erreur.
  const [error, setError] = useState("");

  // Charge les emprunts personnels lorsque la page s’ouvre.
  useEffect(() => {
    const loadMyLoans = async () => {
      try {
        // Cette route Django retourne seulement
        // les emprunts de l’élève connecté.
        const response = await api.get(
          "/loans/my-loans/",
        );

        // Accepte une réponse directe ou paginée.
        const loanList = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];

        setLoans(loanList);
      } catch (requestError) {
        console.error(requestError);

        setError(
          "Impossible de charger vos emprunts.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadMyLoans();
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
            <h1>Mes emprunts</h1>

            <p>
              Consultez vos livres empruntés et leurs
              dates limites.
            </p>
          </div>
        </header>

        {/* Contenu principal */}
        <section className="dashboard-content">
          {isLoading && (
            <p>Chargement de vos emprunts...</p>
          )}

          {error && (
            <p className="loans-error">{error}</p>
          )}

          {!isLoading &&
            !error &&
            loans.length === 0 && (
              <p>Vous n’avez aucun emprunt enregistré.</p>
            )}

          {/* Tableau des emprunts de l’élève */}
          {!isLoading && loans.length > 0 && (
            <div className="loans-table-container">
              <table className="loans-table">
                <thead>
                  <tr>
                    <th>Livre</th>
                    <th>Exemplaire</th>
                    <th>Date d’emprunt</th>
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

                      <td>{loan.inventory_code}</td>

                      <td>
                        {new Date(
                          loan.borrowed_at,
                        ).toLocaleDateString("fr-FR")}
                      </td>

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

export default MyLoansPage;

