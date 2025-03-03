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
        employeeTableBody.innerHTML = ""; // Réinitialiser le corps de la table

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
                <td id="actions">
                    <a href="/employes/modifier/${employee._id}" class="btn btn-modifier">
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

    //addIcons(); // Appel de la fonction pour ajouter les icônes
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


//fonction pour ajouter des icones
function addIcons(){
  for (let i = 0; i < document.getElementById("employeeTableBody").childElementCount; i++) {
    const row = document.getElementById("employeeTableBody").rows[i];
  
    // Accéder à chaque cellule avec firstChild
    const nomCell = row.cells[1]; // Nom
    const villeCell = row.cells[2]; // Ville
    const emailCell = row.cells[3]; // Email
    const roleCell = row.cells[4]; // Rôle
    
    // Créer un conteneur pour les icônes et les ajouter
    nomCell.innerHTML = `<div class="icon-container"><i class="fas fa-user mobileIcon"></i> ${nomCell.innerHTML}</div>`;
    villeCell.innerHTML = `<div class="icon-container"><i class="fas fa-city mobileIcon"></i> ${villeCell.innerHTML}</div>`;
    emailCell.innerHTML = `<div class="icon-container"><i class="fas fa-envelope mobileIcon"></i> ${emailCell.innerHTML}</div>`;
    roleCell.innerHTML = `<div class="icon-container"><i class="fas fa-user-tag mobileIcon"></i> ${roleCell.innerHTML}</div>`;

    // Ajouter la classe mobileIcon
    nomCell.querySelector(".mobileIcon").classList.add("mobileIcon");
    villeCell.querySelector(".mobileIcon").classList.add("mobileIcon"); 
    emailCell.querySelector(".mobileIcon").classList.add("mobileIcon");
    roleCell.querySelector(".mobileIcon").classList.add("mobileIcon");

    // Cacher les icônes sur PC
    if (window.matchMedia("(min-width: 768px)").matches) {
      nomCell.querySelector(".mobileIcon").style.display = "none";
      villeCell.querySelector(".mobileIcon").style.display = "none";
      emailCell.querySelector(".mobileIcon").style.display = "none";
      roleCell.querySelector(".mobileIcon").style.display = "none";
    } else {
      nomCell.querySelector(".mobileIcon").style.display = "inline";
      villeCell.querySelector(".mobileIcon").style.display = "inline";
      emailCell.querySelector(".mobileIcon").style.display = "inline";
      roleCell.querySelector(".mobileIcon").style.display = "inline";
    }
  }
}


//addIcons();