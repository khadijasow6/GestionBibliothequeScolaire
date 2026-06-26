
// useState conserve les informations du formulaire.
import { useState } from "react";

// Outil Axios configuré pour communiquer avec Django.
import api from "../services/api";


function CreateCategoryForm({ onCategoryCreated }) {
  // Informations de la catégorie.
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // État et message du formulaire.
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Envoie la nouvelle catégorie vers Django.
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      await api.post("/categories/", {
        name,
        description,
      });

      // Vide le formulaire après la création.
      setName("");
      setDescription("");

      // Informe la page Livres.
      if (onCategoryCreated) {
        onCategoryCreated();
      }
    } catch (requestError) {
      console.error(requestError);

      const apiError = requestError.response?.data;

      setError(
        apiError?.name?.[0] ||
          apiError?.detail ||
          "Impossible de créer cette catégorie.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="create-category-form"
      onSubmit={handleSubmit}
    >
      <h2>Nouvelle catégorie</h2>

      {/* Nom unique de la catégorie */}
      <div className="category-form-group">
        <label htmlFor="category-name">
          Nom
        </label>

        <input
          id="category-name"
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
          placeholder="Exemple : Informatique"
          required
        />
      </div>

      {/* Description facultative */}
      <div className="category-form-group">
        <label htmlFor="category-description">
          Description
        </label>

        <textarea
          id="category-description"
          rows="3"
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
          }}
          placeholder="Description facultative"
        />
      </div>

      {error && (
        <p className="books-error">
          {error}
        </p>
      )}

      <button
        className="create-category-button"
        type="submit"
        disabled={isLoading}
      >
        {isLoading
          ? "Création..."
          : "Créer la catégorie"}
      </button>
    </form>
  );
}

export default CreateCategoryForm;

