
// NavLink permet de savoir quelle page est actuellement ouverte.
import { NavLink } from "react-router-dom";

// Style de la barre latérale.
import "./Sidebar.css";


function Sidebar() {
  // Récupère les informations de l’utilisateur connecté.
  const user = JSON.parse(
    localStorage.getItem("user") || "{}",
  );

  // Ajoute automatiquement la classe "active"
  // lorsque le lien correspond à la page actuelle.
  const getLinkClass = ({ isActive }) => {
    return isActive
      ? "sidebar-link active"
      : "sidebar-link";
  };

  return (
    <aside className="sidebar">
      {/* Logo et nom de l’application */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          BS
        </div>

        <div className="sidebar-title">
          <h2>Bibliothèque</h2>
          <p>Scolaire</p>
        </div>
      </div>

      {/* Ligne de séparation */}
      <div className="sidebar-separator" />

      {/* Menu de navigation */}
      <nav className="sidebar-navigation">
        <NavLink
          to="/dashboard"
          className={getLinkClass}
        >
          <span className="sidebar-icon">⌂</span>
          Tableau de bord
        </NavLink>

        <NavLink
          to="/books"
          className={getLinkClass}
        >
          <span className="sidebar-icon">▤</span>
          Livres
        </NavLink>

        {user.role === "ELEVE" ? (
          <NavLink
            to="/my-loans"
            className={getLinkClass}
          >
            <span className="sidebar-icon">↔</span>
            Mes emprunts
          </NavLink>
        ) : (
          <NavLink
            to="/loans"
            className={getLinkClass}
          >
            <span className="sidebar-icon">↔</span>
            Emprunts
          </NavLink>
        )}

        {user.role === "ADMINISTRATEUR" && (
          <NavLink
            to="/users"
            className={getLinkClass}
          >
            <span className="sidebar-icon">♙</span>
            Utilisateurs
          </NavLink>
        )}
      </nav>

      {/* Informations de l’utilisateur */}
      <div className="sidebar-user">
        <div className="sidebar-avatar">
          {(user.username || "U")
            .charAt(0)
            .toUpperCase()}
        </div>

        <div>
          <strong>{user.username}</strong>
          <p>{user.role_display || user.role}</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

