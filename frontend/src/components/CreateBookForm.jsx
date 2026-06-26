
// useEffect charge les catégories et les auteurs.
// useState conserve les données du formulaire.
import { useEffect, useState } from "react";

// Outil Axios configuré pour communiquer avec Django.
import api from "../services/api";


function CreateBookForm({ onBookCreated }) {
  // Listes récupérées depuis Django.
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);

  // Informations du livre.
  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [description, setDescription] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [publisher, setPublisher] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [authorId, setAuthorId] = useState("");

  // Informations du premier exemplaire.
  const [inventoryCode, setInventoryCode] = useState("");
  const [condition, setCondition] = useState("BON");
  const [acquisitionDate, setAcquisitionDate] = useState("");

  // Messages et état du formulaire.
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Charge les catégories et les auteurs à l’ouverture.
  useEffect(() => {
    const loadFormData = async () => {
      try {
        const categoriesResponse = await api.get(
          "/categories/",
        );

        const authorsResponse = await api.get(
          "/authors/",
        );

        // Accepte une réponse directe ou paginée.
        const categoryList = Array.isArray(
          categoriesResponse.data,
        )
          ? categoriesResponse.data
          : categoriesResponse.data.results || [];

        const authorList = Array.isArray(
          authorsResponse.data,
        )
          ? authorsResponse.data
          : authorsResponse.data.results || [];

        setCategories(categoryList);
        setAuthors(authorList);
      } catch (requestError) {
        console.error(requestError);

        setError(
          "Impossible de charger les catégories et les auteurs.",
        );
      }
    };

    loadFormData();
  }, []);

  // Crée le livre puis son premier exemplaire.
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      // Création du livre.
      const bookResponse = await api.post("/books/", {
        title,
        isbn,
        description,

        // La valeur est vide ou transformée en nombre.
        publication_year: publicationYear
          ? Number(publicationYear)
          : null,

        publisher,
        category: Number(categoryId),

        // Le backend attend une liste d’identifiants.
        authors: [Number(authorId)],
      });

      // Récupère l’identifiant du livre nouvellement créé.
      const newBookId = bookResponse.data.id;

      // Création du premier exemplaire disponible.
      await api.post("/book-copies/", {
        book: newBookId,
        inventory_code: inventoryCode,
        status: "DISPONIBLE",
        condition,

        // La date peut être vide.
        acquisition_date: acquisitionDate || null,
      });

      // Vide le formulaire après la création.
      setTitle("");
      setIsbn("");
      setDescription("");
      setPublicationYear("");
      setPublisher("");
      setCategoryId("");
      setAuthorId("");
      setInventoryCode("");
      setCondition("BON");
      setAcquisitionDate("");

      // Informe la page Livres.
      if (onBookCreated) {
        onBookCreated();
      }
    } catch (requestError) {
      console.error(requestError);

      const apiError = requestError.response?.data;

      setError(
        apiError?.isbn?.[0] ||
          apiError?.inventory_code?.[0] ||
          apiError?.title?.[0] ||
          apiError?.category?.[0] ||
          apiError?.authors?.[0] ||
          apiError?.detail ||
          "Impossible de créer le livre.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="create-book-form"
      onSubmit={handleSubmit}
    >
      <h2>Nouveau livre</h2>

      {/* Titre du livre */}
      <div className="book-form-group">
        <label htmlFor="book-title">
          Titre
        </label>

        <input
          id="book-title"
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          required
        />
      </div>

      {/* Numéro ISBN unique */}
      <div className="book-form-group">
        <label htmlFor="book-isbn">
          ISBN
        </label>

        <input
          id="book-isbn"
          type="text"
          value={isbn}
          maxLength="13"
          onChange={(event) => {
            setIsbn(event.target.value);
          }}
          placeholder="Exemple : 9782070000000"
          required
        />
      </div>

      {/* Catégorie du livre */}
      <div className="book-form-group">
        <label htmlFor="book-category">
          Catégorie
        </label>

        <select
          id="book-category"
          value={categoryId}
          onChange={(event) => {
            setCategoryId(event.target.value);
          }}
          required
        >
          <option value="">
            Sélectionner une catégorie
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Auteur du livre */}
      <div className="book-form-group">
        <label htmlFor="book-author">
          Auteur
        </label>

        <select
          id="book-author"
          value={authorId}
          onChange={(event) => {
            setAuthorId(event.target.value);
          }}
          required
        >
          <option value="">
            Sélectionner un auteur
          </option>

          {authors.map((author) => (
            <option
              key={author.id}
              value={author.id}
            >
              {author.full_name}
            </option>
          ))}
        </select>
      </div>

      {/* Année de publication */}
      <div className="book-form-group">
        <label htmlFor="publication-year">
          Année de publication
        </label>

        <input
          id="publication-year"
          type="number"
          min="1000"
          max={new Date().getFullYear()}
          value={publicationYear}
          onChange={(event) => {
            setPublicationYear(event.target.value);
          }}
        />
      </div>

      {/* Maison d’édition */}
      <div className="book-form-group">
        <label htmlFor="book-publisher">
          Éditeur
        </label>

        <input
          id="book-publisher"
          type="text"
          value={publisher}
          onChange={(event) => {
            setPublisher(event.target.value);
          }}
        />
      </div>

      {/* Code unique de l’exemplaire */}
      <div className="book-form-group">
        <label htmlFor="inventory-code">
          Code d’inventaire
        </label>

        <input
          id="inventory-code"
          type="text"
          value={inventoryCode}
          onChange={(event) => {
            setInventoryCode(event.target.value);
          }}
          placeholder="Exemple : EX-0004"
          required
        />
      </div>

      {/* État physique de l’exemplaire */}
      <div className="book-form-group">
        <label htmlFor="book-condition">
          État physique
        </label>

        <select
          id="book-condition"
          value={condition}
          onChange={(event) => {
            setCondition(event.target.value);
          }}
          required
        >
          <option value="NEUF">Neuf</option>
          <option value="BON">Bon état</option>
          <option value="MOYEN">État moyen</option>
          <option value="MAUVAIS">Mauvais état</option>
        </select>
      </div>

      {/* Date d’achat ou d’acquisition */}
      <div className="book-form-group">
        <label htmlFor="acquisition-date">
          Date d’acquisition
        </label>

        <input
          id="acquisition-date"
          type="date"
          value={acquisitionDate}
          onChange={(event) => {
            setAcquisitionDate(event.target.value);
          }}
        />
      </div>

      {/* Description du livre */}
      <div className="book-form-group book-description-group">
        <label htmlFor="book-description">
          Description
        </label>

        <textarea
          id="book-description"
          rows="4"
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
          }}
        />
      </div>

      {error && (
        <p className="books-error">
          {error}
        </p>
      )}

      <button
        className="create-book-button"
        type="submit"
        disabled={isLoading}
      >
        {isLoading
          ? "Création..."
          : "Créer le livre et l’exemplaire"}
      </button>
    </form>
  );
}

export default CreateBookForm;
