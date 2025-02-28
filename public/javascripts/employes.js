document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const employeeTableBody = document.getElementById("employeeTableBody");
  const messageContainer = document.getElementById("message-container");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!token) {
    alert("Vous devez être connecté.");
    window.location.href = "/";
    return;
  }
  

  async function fetchEmployees() {
    try {
      const response = await fetch("/users", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok)
        throw new Error("Erreur lors du chargement des employés.");

      const employees = await response.json();
      employeeTableBody.innerHTML = "";

      employees.forEach((employee) => {
        const row = document.createElement("tr");

        row.innerHTML = `
                    <td>${
                      employee.image
                        ? `<img src="images/${employee.image}" alt="Photo" class="employee-photo">`
                        : `<img src="images/5856.jpg" alt="Photo" class="employee-photo">`
                    }</td>
                    <td>${employee.name}</td>
                    <td>${employee.city}</td>
                    <td>${employee.email}</td>
                    <td>${employee.role}</td>
                    <td>
                        <a ${
                          user.role === "admin" || user.id === employee._id
                            ? ""
                            : "disabled"
                        }href="/employes/modifier/${employee._id}" class="btn">
                            <i class="fas fa-edit"></i> Modifier
                        </a>
                      ${
                        user.role === "admin"
                          ? `
                    <button class="btn btn-danger" onclick="deleteEmployee('${employee._id}', '${employee.name}')">
                    <i class="fas fa-trash"></i> Supprimer
                    </button>`
                          : ""
                      }

                    </td>
                `;
        employeeTableBody.appendChild(row);
      });
    } catch (error) {
      console.error("Erreur:", error);
    }
  }

  window.deleteEmployee = async function (employeeId, name) {

    const currentUser = JSON.parse(localStorage.getItem("user"));
    console.log(currentUser);
    console.log(employeeId);
    if(currentUser&& currentUser.role ==="admin"){
    
    if (currentUser && currentUser.id === employeeId) {
      alert("Vous ne pouvez pas supprimer votre propre compte !");
      return;
    }

    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${name} ?`)) return;

    try {
      const response = await fetch(`/users/${employeeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression.");

      messageContainer.innerText = "Employé supprimé avec succès.";
      messageContainer.style.display = "block";

      setTimeout(() => {
        messageContainer.style.display = "none";
        fetchEmployees();
      }, 1500);
    } catch (error) {
      console.error("Erreur:", error);
    }
}else{
    alert("Vous ne pouvez pas le droit contacter l'administrateur !");
}
  };
       

  fetchEmployees();
});
