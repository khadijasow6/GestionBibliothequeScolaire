function DashboardPage() {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}",
  );

  return (
    <main>
      <h1>Tableau de bord</h1>

      <p>
        Bienvenue {user.first_name || user.username}.
      </p>

      <p>
        Rôle : {user.role_display || user.role}
      </p>
    </main>
  );
}

export default DashboardPage;