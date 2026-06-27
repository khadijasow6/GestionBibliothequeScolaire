
// Link permet de naviguer sans recharger complètement la page.
import { Link } from "react-router-dom";

// Style de la page d’accueil.
import "./HomePage.css";


function HomePage() {
  // Vérifie si un utilisateur est déjà connecté.
  const isAuthenticated = Boolean(
    localStorage.getItem("accessToken"),
  );

  return (
    <div className="home-page">
      {/* Barre de navigation */}
      <nav className="home-navbar">
        <div className="home-logo">
          Bibliothèque Scolaire
        </div>

        <Link
          className="home-login-link"
          to={isAuthenticated ? "/dashboard" : "/login"}
        >
          {isAuthenticated
            ? "Tableau de bord"
            : "Se connecter"}
        </Link>
      </nav>

      {/* Présentation principale */}
      <main className="home-main">
        <section className="home-hero">
          <div className="home-hero-content">
            <span className="home-badge">
              Gestion simple et moderne
            </span>

            <h1>
              Bienvenue dans votre bibliothèque scolaire
            </h1>

            <p>
              Consultez les livres disponibles, suivez vos
              emprunts et facilitez la gestion de la
              bibliothèque.
            </p>

            <Link
              className="home-primary-button"
              to={isAuthenticated ? "/dashboard" : "/login"}
            >
              {isAuthenticated
                ? "Accéder à mon espace"
                : "Commencer"}
            </Link>
          </div>

          {/* Illustration simple sans image externe */}
          <div className="home-illustration">
            <div className="home-book home-book-one">
              📘
            </div>

            <div className="home-book home-book-two">
              📗
            </div>

            <div className="home-book home-book-three">
              📕
            </div>
          </div>
        </section>

        {/* Présentation des services */}
        <section className="home-features">
          <article className="home-feature-card">
            <span className="home-feature-icon">📚</span>

            <h2>Consulter les livres</h2>

            <p>
              Découvrez les ouvrages enregistrés dans la
              bibliothèque scolaire.
            </p>
          </article>

          <article className="home-feature-card">
            <span className="home-feature-icon">📝</span>

            <h2>Gérer les emprunts</h2>

            <p>
              Le personnel peut enregistrer les emprunts,
              les retours et les livres perdus.
            </p>
          </article>

          <article className="home-feature-card">
            <span className="home-feature-icon">👨‍🎓</span>

            <h2>Espace élève</h2>

            <p>
              Chaque élève peut consulter ses emprunts et
              vérifier les dates de retour.
            </p>
          </article>
        </section>
      </main>

      {/* Pied de page */}
      <footer className="home-footer">
        <p>
          © 2026 Bibliothèque Scolaire — Tous droits réservés
        </p>
      </footer>
    </div>
  );
}

export default HomePage;

