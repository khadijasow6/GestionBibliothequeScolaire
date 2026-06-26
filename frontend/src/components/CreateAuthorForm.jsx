
// useState permet de conserver les valeurs du formulaire.
import { useState } from "react";

// Outil Axios configuré pour communiquer avec Django.
import api from "../services/api";


function CreateAuthorForm({ onAuthorCreated }) {
  // Informations de l’auteur.
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [biography, setBiography] = useState("");

  // Messages et état du formulaire.
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Envoie le nouvel auteur vers Django.
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      await api.post("/authors/", {
        first_name: firstName,
        last_name: lastName,
        biography,
      });

      // Vide le formulaire après la création.
      setFirstName("");
      setLastName("");
      setBiography("");

      // Informe la page Livres qu’un auteur a été créé.
      if (onAuthorCreated) {
        onAuthorCreated();
      }
    } catch (requestError) {
      console.error(requestError);

      const apiError = requestError.response?.data;

      setError(
        apiError?.first_name?.[0] ||
          apiError?.last_name?.[0] ||
          apiError?.detail ||
          "Impossible de créer cet auteur.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="create-author-form"
      onSubmit={handleSubmit}
    >
      <h2>Nouvel auteur</h2>

      {/* Prénom de l’auteur */}
      <div className="author-form-group">
        <label htmlFor="author-first-name">
          Prénom
        </label>

        <input
          id="author-first-name"
          type="text"
          value={firstName}
          onChange={(event) => {
            setFirstName(event.target.value);
          }}
          required
        />
      </div>

      {/* Nom de famille de l’auteur */}
      <div className="author-form-group">
        <label htmlFor="author-last-name">
          Nom
        </label>

        <input
          id="author-last-name"
          type="text"
          value={lastName}
          onChange={(event) => {
            setLastName(event.target.value);
          }}
          required
        />
      </div>

      {/* Biographie facultative */}
      <div className="author-form-group author-biography-group">
        <label htmlFor="author-biography">
          Biographie
        </label>

        <textarea
          id="author-biography"
          rows="3"
          value={biography}
          onChange={(event) => {
            setBiography(event.target.value);
          }}
          placeholder="Biographie facultative"
        />
      </div>

      {error && (
        <p className="books-error">
          {error}
        </p>
      )}

      <button
        className="create-author-button"
        type="submit"
        disabled={isLoading}
      >
        {isLoading
          ? "Création..."
          : "Créer l’auteur"}
      </button>
    </form>
  );
}

export default CreateAuthorForm;

