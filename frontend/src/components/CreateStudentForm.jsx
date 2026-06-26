
// useState permet de conserver les valeurs du formulaire.
import { useState } from "react";

// Outil Axios configuré pour communiquer avec Django.
import api from "../services/api";


function CreateStudentForm({ onStudentCreated }) {
  // Informations saisies dans le formulaire.
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [matricule, setMatricule] = useState("");
  const [password, setPassword] = useState("");

  // Messages et état du formulaire.
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Envoie le nouvel élève vers Django.
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      await api.post("/auth/users/", {
        first_name: firstName,
        last_name: lastName,
        username,
        matricule,
        password,

        // Le rôle est automatiquement celui d’un élève.
        role: "ELEVE",

        // Le compte est actif dès sa création.
        is_active: true,
      });

      // Vide les champs après la création.
      setFirstName("");
      setLastName("");
      setUsername("");
      setMatricule("");
      setPassword("");

      // Informe la page Utilisateurs.
      if (onStudentCreated) {
        onStudentCreated();
      }
    } catch (requestError) {
      console.error(requestError);

      const apiError = requestError.response?.data;

      setError(
        apiError?.username?.[0] ||
          apiError?.matricule?.[0] ||
          apiError?.password?.[0] ||
          apiError?.detail ||
          "Impossible de créer cet élève.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="create-student-form"
      onSubmit={handleSubmit}
    >
      <h2>Nouvel élève</h2>

      {/* Prénom de l’élève */}
      <div className="student-form-group">
        <label htmlFor="student-first-name">
          Prénom
        </label>

        <input
          id="student-first-name"
          type="text"
          value={firstName}
          onChange={(event) => {
            setFirstName(event.target.value);
          }}
          required
        />
      </div>

      {/* Nom de famille */}
      <div className="student-form-group">
        <label htmlFor="student-last-name">
          Nom
        </label>

        <input
          id="student-last-name"
          type="text"
          value={lastName}
          onChange={(event) => {
            setLastName(event.target.value);
          }}
          required
        />
      </div>

      {/* Identifiant utilisé pour la connexion */}
      <div className="student-form-group">
        <label htmlFor="student-username">
          Nom d’utilisateur
        </label>

        <input
          id="student-username"
          type="text"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
          }}
          required
        />
      </div>

      {/* Numéro unique de l’élève */}
      <div className="student-form-group">
        <label htmlFor="student-matricule">
          Matricule
        </label>

        <input
          id="student-matricule"
          type="text"
          value={matricule}
          onChange={(event) => {
            setMatricule(event.target.value);
          }}
          placeholder="Exemple : ELV-002"
          required
        />
      </div>

      {/* Mot de passe initial */}
      <div className="student-form-group">
        <label htmlFor="student-password">
          Mot de passe
        </label>

        <input
          id="student-password"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          minLength="8"
          required
        />
      </div>

      {error && (
        <p className="users-error">
          {error}
        </p>
      )}

      <button
        className="create-student-button"
        type="submit"
        disabled={isLoading}
      >
        {isLoading
          ? "Création..."
          : "Créer l’élève"}
      </button>
    </form>
  );
}

export default CreateStudentForm;

