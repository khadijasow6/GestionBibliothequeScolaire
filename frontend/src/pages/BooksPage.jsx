
// useEffect charge les livres à l’ouverture de la page.
// useState conserve les données et les messages.
import { useEffect, useState } from "react";

// Formulaire permettant de créer une catégorie.
import CreateCategoryForm from "../components/CreateCategoryForm";

// Formulaire permettant de créer un auteur.
import CreateAuthorForm from "../components/CreateAuthorForm";

// Formulaire permettant de créer un livre et son exemplaire.
import CreateBookForm from "../components/CreateBookForm";

// Barre latérale de navigation.
import Sidebar from "../components/Sidebar";

// Outil Axios configuré pour communiquer avec Django.
import api from "../services/api";

// Styles de la page.
import "./DashboardPage.css";
import "./BooksPage.css";


function BooksPage() {
  // Liste des livres reçue depuis Django.
  const [books, setBooks] = useState([]);

  // État de chargement.
  const [isLoading, setIsLoading] = useState(true);

  // Messages affichés à l’utilisateur.
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Cette clé recharge le formulaire du livre après
  // la création d’une catégorie ou d’un auteur.
  const [bookFormKey, setBookFormKey] = useState(0);

  // Récupère l’utilisateur connecté.
  const storedUser = localStorage.getItem("user");

  const currentUser = storedUser
    ? JSON.parse(storedUser)
    : null;

  // Seul le personnel peut gérer le catalogue.
  const canManageBooks =
    currentUser?.role === "ADMINISTRATEUR" ||
    currentUser?.role === "BIBLIOTHECAIRE";

  // Charge les livres depuis Django.
  const loadBooks = async () => {
    try {
      const response = await api.get("/books/");

      // Accepte une réponse directe ou paginée.
      const bookList = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      setBooks(bookList);
    } catch (requestError) {
      console.error(requestError);

      setError(
        "Impossible de charger la liste des livres.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Charge les livres à l’ouverture de la page.
  useEffect(() => {
    loadBooks();
  }, []);

  // Fonction appelée après la création d’une catégorie.
  const handleCategoryCreated = () => {
    setError("");

    setSuccess(
      "La nouvelle catégorie a été créée avec succès.",
    );

    // Recharge le formulaire afin que la nouvelle
    // catégorie apparaisse dans la liste.
    setBookFormKey((currentKey) => currentKey + 1);
  };

  // Fonction appelée après la création d’un auteur.
  const handleAuthorCreated = () => {
    setError("");

    setSuccess(
      "Le nouvel auteur a été créé avec succès.",
    );

    // Recharge le formulaire afin que le nouvel
    // auteur apparaisse dans la liste.
    setBookFormKey((currentKey) => currentKey + 1);
  };

  // Fonction appelée après la création d’un livre.
  const handleBookCreated = async () => {
    setError("");

    setSuccess(
      "Le livre et son exemplaire ont été créés avec succès.",
    );

    // Recharge immédiatement la liste des livres.
    await loadBooks();
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-page">
        {/* En-tête de la page */}
        <header className="dashboard-header">
          <div>
            <h1>Livres</h1>

            <p>
              Gérez les catégories, les auteurs, les livres
              et leurs exemplaires.
            </p>
          </div>
        </header>

        <section className="dashboard-content">
          {/* Formulaires visibles seulement par le personnel */}
          {canManageBooks && (
            <>
              <CreateCategoryForm
                onCategoryCreated={handleCategoryCreated}
              />

              <CreateAuthorForm
                onAuthorCreated={handleAuthorCreated}
              />

              <CreateBookForm
                key={bookFormKey}
                onBookCreated={handleBookCreated}
              />
            </>
          )}

          {/* Messages */}
          {success && (
            <p className="books-success">
              {success}
            </p>
          )}

          {error && (
            <p className="books-error">
              {error}
            </p>
          )}

          {isLoading && (
            <p>Chargement des livres...</p>
          )}

          {!isLoading &&
            !error &&
            books.length === 0 && (
              <p>Aucun livre enregistré.</p>
            )}

          {/* Liste des livres */}
          {!isLoading && books.length > 0 && (
            <div className="books-grid">
              {books.map((book) => (
                <article
                  className="book-card"
                  key={book.id}
                >
                  <h2>{book.title}</h2>

                  <div className="book-details">
                    <span className="book-label">
                      ISBN
                    </span>
                    <span>{book.isbn}</span>

                    <span className="book-label">
                      Catégorie
                    </span>
                    <span>
                      {book.category_name ||
                        "Non renseignée"}
                    </span>

                    <span className="book-label">
                      Auteur
                    </span>
                    <span>
                      {book.author_names?.length > 0
                        ? book.author_names.join(", ")
                        : "Non renseigné"}
                    </span>

                    <span className="book-label">
                      Année
                    </span>
                    <span>
                      {book.publication_year || "—"}
                    </span>

                    <span className="book-label">
                      Éditeur
                    </span>
                    <span>
                      {book.publisher || "—"}
                    </span>
                  </div>

                  {book.description && (
                    <p className="book-description">
                      {book.description}
                    </p>
                  )}
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

