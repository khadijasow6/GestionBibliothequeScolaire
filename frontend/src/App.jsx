// Page permettant à l’élève de consulter ses emprunts.
import MyLoansPage from "./pages/MyLoansPage";
// Outils permettant de gérer les différentes pages React.

// Page de gestion des utilisateurs réservée à l’administrateur.
import UsersPage from "./pages/UsersPage";


import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

// Importation des pages de l’application.
import BooksPage from "./pages/BooksPage";
import DashboardPage from "./pages/DashboardPage";
import LoansPage from "./pages/LoansPage";
import LoginPage from "./pages/LoginPage";


function App() {
  // Récupère le token enregistré après la connexion.
  const token = localStorage.getItem("accessToken");

  return (
    // Active la navigation dans l’application.
    <BrowserRouter>
      <Routes>
        {/* L’adresse principale redirige vers la connexion */}
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

        {/* Page de gestion des emprunts */}
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
             {/* Page personnelle des emprunts de l’élève */}
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

{/* Page de gestion des utilisateurs */}
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



        {/* Toute adresse inconnue retourne vers une page valide */}
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

