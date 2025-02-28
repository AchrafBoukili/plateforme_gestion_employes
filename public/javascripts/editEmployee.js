document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const messageContainer = document.getElementById("message-container");
  const roleSelect = document.getElementById("role");

  if (!token) {
    alert("Vous devez être connecté.");
    window.location.href = "/";
    return;
  }

  const employeeId = window.location.pathname.split("/").pop();

  document.getElementById("employeeId").value = employeeId;

  async function fetchEmployee() {
    try {
      const response = await fetch(`/users/${employeeId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok)
        throw new Error("Erreur lors du chargement des données.");

      const employee = await response.json();
      if (employee.role === "admin") {
        roleSelect.removeAttribute("disabled");
      }
      document.getElementById("name").value = employee.name;
      document.getElementById("city").value = employee.city;
      document.getElementById("email").value = employee.email;
      document.getElementById("role").value = employee.role;
      document.getElementById("preview").src =employee.image && employee.image !==''?
       `/images/${employee.image}` : "/images/5856.jpg";
     
    } catch (error) {
      console.error("Erreur:", error);
    }
  }

  document
    .getElementById("editEmployeeForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log(currentUser)
      if(currentUser.id==employeeId || currentUser.role  === 'admin'){
      const formData = new FormData();
      formData.append("name", document.getElementById("name").value);
      formData.append("city", document.getElementById("city").value);
      formData.append("email", document.getElementById("email").value);
      formData.append("role", document.getElementById("role").value);
      formData.append("password", document.getElementById("password").value);

      const imageFile = document.getElementById("imageUpload").files[0];
      if (imageFile) {
          formData.append("image", imageFile);
      }

      try {
          const response = await fetch(`/users/${employeeId}`, {
              method: "PUT",
              headers: { "Authorization": `Bearer ${token}` },
              body: formData
          });
          if (!response.ok) throw new Error("Erreur lors de la mise à jour.");
      
          const data = await response.json();

          if(currentUser.id==employeeId){
  
            localStorage.setItem("user", JSON.stringify({id:data.user._id, name: data.user.name, email: data.user.email, role: data.user.role, city: data.user.city, image: data.user.image}));
            //localStorage.setItem("token", data.token)
          }
          messageContainer.innerText = "Mise à jour réussie.";
          messageContainer.classList.add("alert-success");
          messageContainer.style.display = "block";

          setTimeout(() => {
              messageContainer.style.display = "none";
            window.location.href = "/employes"; 
          }, 1500);
      } catch (error) {
        console.log(error)
          messageContainer.innerText = "Erreur lors de la mise à jour.";
          messageContainer.classList.add("alert-danger");
          messageContainer.style.display = "block";
      }
  }else{
    alert("Vous ne pouvez pas le droit contacter l'administrateur !");

  }  });






  document.getElementById("imageUpload").addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              document.getElementById("preview").src = e.target.result;
          };
          reader.readAsDataURL(file);
      }
  });

  fetchEmployee(); 
});