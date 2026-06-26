
// useEffect exécute une action au chargement de la page.
// useState permet de conserver les livres et les états.
import { useEffect, useState } from "react";

// Barre latérale commune aux pages connectées.
import Sidebar from "../components/Sidebar";

// Outil configuré pour communiquer avec Django.
import api from "../services/api";

// Styles communs et styles spécifiques à la page Livres.
import "./DashboardPage.css";
import "./BooksPage.css";


function BooksPage() {
  // Stocke la liste des livres reçue depuis Django.
  const [books, setBooks] = useState([]);

  // Indique si les livres sont encore en chargement.
  const [isLoading, setIsLoading] = useState(true);

  // Stocke un éventuel message d’erreur.
  const [error, setError] = useState("");

  // Charge les livres lorsque la page s’ouvre.
  useEffect(() => {
    const loadBooks = async () => {
      try {
        // Envoie une requête GET vers l’API Django.
        const response = await api.get("/books/");

        // Accepte une réponse directe ou paginée.
        const bookList = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];

        // Enregistre les livres reçus.
        setBooks(bookList);
      } catch (requestError) {
        console.error(requestError);

        setError(
          "Impossible de charger la liste des livres.",
        );
      } finally {
        // Le chargement est terminé.
        setIsLoading(false);
      }
    };

    loadBooks();
  }, []);

  return (
    // Contient la barre latérale et la partie principale.
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-page">
        {/* En-tête de la page */}
        <header className="dashboard-header">
          <div>
            <h1>Livres</h1>

            <p>
              Consultez le catalogue de la bibliothèque.
            </p>
          </div>
        </header>

        {/* Contenu principal */}
        <section className="dashboard-content">
          {isLoading && (
            <p>Chargement des livres...</p>
          )}

          {error && (
            <p className="books-error">
              {error}
            </p>
          )}

          {!isLoading &&
            !error &&
            books.length === 0 && (
              <p>Aucun livre enregistré.</p>
            )}

          {/* Grille contenant les cartes des livres */}
          {!isLoading && books.length > 0 && (
            <div className="books-grid">
              {books.map((book) => (
                // Une carte pour chaque livre.
                <article
                  className="book-card"
                  key={book.id}
                >
                  <h2>{book.title}</h2>

                  {/* Informations détaillées du livre */}
                  <div className="book-information">
                    <p>
                      <strong>ISBN</strong>
                      <span>{book.isbn}</span>
                    </p>

                    <p>
                      <strong>Catégorie</strong>
                      <span>
                        {book.category_name ||
                          "Non renseignée"}
                      </span>
                    </p>

                    <p>
                      <strong>Auteur(s)</strong>
                      <span>
                        {book.author_names?.join(", ") ||
                          "Non renseigné"}
                      </span>
                    </p>

                    <p>
                      <strong>Année</strong>
                      <span>
                        {book.publication_year ||
                          "Non renseignée"}
                      </span>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default BooksPage;

