// Axios permet à React d’envoyer des requêtes vers Django.
import axios from "axios";


// Instance principale utilisée dans toutes les pages.
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",

  headers: {
    "Content-Type": "application/json",
  },
});


// Avant chaque requête, ajoute le token d’accès.
api.interceptors.request.use((config) => {
  const accessToken =
    localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization =
      `Bearer ${accessToken}`;
  }

  return config;
});


// Cette fonction déconnecte complètement l’utilisateur.
const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  // Évite une nouvelle redirection si nous sommes déjà
  // sur la page de connexion.
  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
};


// Intercepte les réponses contenant une erreur.
api.interceptors.response.use(
  // Lorsque la réponse est correcte, elle est renvoyée normalement.
  (response) => response,

  // Cette partie est exécutée lorsqu’une erreur survient.
  async (error) => {
    const originalRequest = error.config;

    // Vérifie si l’erreur vient d’un token expiré.
    const tokenExpired =
      error.response?.status === 401;

    // Empêche de renouveler plusieurs fois la même requête.
    const requestNotRetried =
      !originalRequest?._retry;

    // Ne tente pas de renouveler le token
    // pendant une tentative de connexion.
    const isNotLoginRequest =
      !originalRequest?.url?.includes(
        "/auth/login/",
      );

    if (
      tokenExpired &&
      requestNotRetried &&
      isNotLoginRequest
    ) {
      originalRequest._retry = true;

      // Récupère le refresh token enregistré.
      const refreshToken =
        localStorage.getItem("refreshToken");

      // Sans refresh token, la reconnexion est obligatoire.
      if (!refreshToken) {
        logoutUser();
        return Promise.reject(error);
      }

      try {
        // Demande un nouveau token d’accès à Django.
        const response = await axios.post(
          "http://127.0.0.1:8000/api/auth/refresh/",
          {
            refresh: refreshToken,
          },
        );

        const newAccessToken =
          response.data.access;

        // Enregistre le nouveau token.
        localStorage.setItem(
          "accessToken",
          newAccessToken,
        );

        // Ajoute le nouveau token à la requête qui avait échoué.
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        // Relance automatiquement la requête.
        return api(originalRequest);
      } catch (refreshError) {
        // Si le refresh token est aussi expiré,
        // l’utilisateur est redirigé vers la connexion.
        logoutUser();

        return Promise.reject(refreshError);
      }
    }

    // Renvoie les autres erreurs normalement.
    return Promise.reject(error);
  },
);


export default api;