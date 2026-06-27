
// Outils permettant de gérer les différentes pages.
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

// Pages de l’application.
import BooksPage from "./pages/BooksPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import LoansPage from "./pages/LoansPage";
import LoginPage from "./pages/LoginPage";
import MyLoansPage from "./pages/MyLoansPage";
import UsersPage from "./pages/UsersPage";


function App() {
  // Récupère le token enregistré après la connexion.
  const token = localStorage.getItem("accessToken");

  return (
    // Active la navigation dans l’application.
    <BrowserRouter>
      <Routes>
        {/* Page d’accueil publique */}
        <Route
          path="/"
          element={<HomePage />}
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

        {/* Catalogue des livres */}
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

        {/* Gestion générale des emprunts */}
        <Route
          path="/loans"
          element={
            token ? (
              <LoansPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Emprunts personnels de l’élève */}
        <Route
          path="/my-loans"
          element={
            token ? (
              <MyLoansPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Gestion des utilisateurs */}
        <Route
          path="/users"
          element={
            token ? (
              <UsersPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Une adresse inconnue retourne à l’accueil */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

