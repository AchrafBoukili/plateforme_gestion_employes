document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const messageContainer = document.getElementById("message-container");
  const roleSelect = document.getElementById("role");

  if (!token) {
    alert("Vous devez être connecté.");
    window.location.href = "/";
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem("user"));

  document
    .getElementById("addEmployeeForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      if(currentUser.role==='admin'){
      const formData = new FormData();
      formData.append("name", document.getElementById("name").value);
      formData.append("city", document.getElementById("city").value);
      formData.append("email", document.getElementById("email").value);
      formData.append("password", document.getElementById("password").value);
      formData.append("role", document.getElementById("role").value);

      // ✅ Add image file if it exists
      const imageFile = document.getElementById("imageUpload").files[0];
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch("/users", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // ✅ Do NOT set "Content-Type" manually
        body: formData,
      });

      if (!response.ok) throw new Error("Erreur lors de l'ajout de l'employé.");

      messageContainer.innerText = "Employé ajouté avec succès.";
      messageContainer.classList.add("alert-success");
      messageContainer.style.display = "block";

      setTimeout(() => {
        messageContainer.style.display = "none";
        window.location.href = "/employes";
      }, 1500);
    }});

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
});
