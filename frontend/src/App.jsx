
// Outils de React Router pour gérer les différentes pages.
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

// Importation des pages de l’application.
import BooksPage from "./pages/BooksPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";


function App() {
  // Récupère le token enregistré après la connexion.
  // Sa présence signifie que l’utilisateur est connecté.
  const token = localStorage.getItem("accessToken");

  return (
    // Active la navigation React dans toute l’application.
    <BrowserRouter>
      <Routes>
        {/* La page d’accueil redirige vers la connexion */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Page de connexion */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* Tableau de bord protégé */}
        <Route
          path="/dashboard"
          element={
            token ? (
              <DashboardPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Page du catalogue des livres */}
        <Route
          path="/books"
          element={
            token ? (
              <BooksPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Toute adresse inconnue retourne au tableau de bord */}
        <Route
          path="*"
          element={
            <Navigate
              to={token ? "/dashboard" : "/login"}
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

