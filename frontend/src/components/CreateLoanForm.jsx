
// useEffect charge les élèves et les exemplaires disponibles.
// useState conserve les valeurs du formulaire.
import { useEffect, useState } from "react";

// Outil Axios configuré pour communiquer avec Django.
import api from "../services/api";


function CreateLoanForm({ onLoanCreated }) {
  // Liste des élèves actifs.
  const [students, setStudents] = useState([]);

  // Liste des exemplaires disponibles.
  const [availableCopies, setAvailableCopies] = useState([]);

  // Valeurs sélectionnées dans le formulaire.
  const [studentId, setStudentId] = useState("");
  const [bookCopyId, setBookCopyId] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Messages affichés à l’utilisateur.
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Charge les informations nécessaires à l’ouverture du formulaire.
  useEffect(() => {
    const loadFormData = async () => {
      try {
        // Récupère les élèves actifs.
        const studentsResponse = await api.get(
          "/auth/users/students/",
        );

        // Récupère uniquement les exemplaires disponibles.
        const copiesResponse = await api.get(
          "/book-copies/available/",
        );

        setStudents(studentsResponse.data);
        setAvailableCopies(copiesResponse.data);
      } catch (requestError) {
        console.error(requestError);

        setError(
          "Impossible de charger les données du formulaire.",
        );
      }
    };

    loadFormData();
  }, []);

  // Envoie le nouvel emprunt vers Django.
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      // Transforme la date choisie en date complète ISO.
      const dueAt = new Date(
        `${dueDate}T23:59:00`,
      ).toISOString();

      // Crée l’emprunt dans le backend.
      await api.post("/loans/", {
        student: Number(studentId),
        book_copy: Number(bookCopyId),
        due_at: dueAt,
      });

      // Réinitialise le formulaire.
      setStudentId("");
      setBookCopyId("");
      setDueDate("");

      // Informe la page principale qu’un emprunt a été créé.
      if (onLoanCreated) {
        onLoanCreated();
      }
    } catch (requestError) {
      console.error(requestError);

      // Affiche le message envoyé par Django lorsqu’il existe.
      const apiError = requestError.response?.data;

      setError(
        apiError?.detail ||
          apiError?.due_at?.[0] ||
          "Impossible de créer l’emprunt.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="create-loan-form"
      onSubmit={handleSubmit}
    >
      <h2>Nouvel emprunt</h2>

      {/* Sélection de l’élève */}
      <div className="loan-form-group">
        <label htmlFor="student">
          Élève
        </label>

        <select
          id="student"
          value={studentId}
          onChange={(event) => {
            setStudentId(event.target.value);
          }}
          required
        >
          <option value="">
            Sélectionner un élève
          </option>

          {students.map((student) => (
            <option
              key={student.id}
              value={student.id}
            >
              {student.first_name} {student.last_name}
              {" - "}
              {student.username}
            </option>
          ))}
        </select>
      </div>

      {/* Sélection de l’exemplaire disponible */}
      <div className="loan-form-group">
        <label htmlFor="book-copy">
          Exemplaire
        </label>

        <select
          id="book-copy"
          value={bookCopyId}
          onChange={(event) => {
            setBookCopyId(event.target.value);
          }}
          required
        >
          <option value="">
            Sélectionner un exemplaire
          </option>

          {availableCopies.map((copy) => (
            <option
              key={copy.id}
              value={copy.id}
            >
              {copy.book_title} - {copy.inventory_code}
            </option>
          ))}
        </select>
      </div>

      {/* Date limite de restitution */}
      <div className="loan-form-group">
        <label htmlFor="due-date">
          Date limite
        </label>

        <input
          id="due-date"
          type="date"
          value={dueDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={(event) => {
            setDueDate(event.target.value);
          }}
          required
        />
      </div>

      {error && (
        <p className="loans-error">
          {error}
        </p>
      )}

      <button
        className="create-loan-button"
        type="submit"
        disabled={isLoading}
      >
        {isLoading
          ? "Création..."
          : "Créer l’emprunt"}
      </button>
    </form>
  );
}

export default CreateLoanForm;

