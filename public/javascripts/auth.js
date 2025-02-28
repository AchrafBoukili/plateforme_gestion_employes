document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));  

    if (!token) {
        console.log("No token found - Redirecting to login");
        if (window.location.pathname !== "/") {
            window.location.href = "/"; 
        }
        return;
    }

    if (token && user && window.location.pathname === "/") {
        console.log("User already logged in - Redirecting to dashboard");
        window.location.href = "/dashboard";
        return;
    }

    if (window.location.pathname === "/dashboard") {

        document.getElementById("userName").innerText = user.name || "Non renseigné";
        document.getElementById("userEmail").innerText = user.email || "Non renseigné";
        document.getElementById("userRole").innerText = user.role || "Non renseigné";
        document.getElementById("editProfile").href = `/employes/modifier/${user.id}`;
        if (user.image && user.image !== "") {
            document.getElementById("profilePhoto").src ="/images/"+ user.image;
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("authForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    console.log("Login successful - Redirecting to dashboard");
                    window.location.href = "/dashboard";
                } else {
                    document.getElementById("errorMessage").innerText = data.error;
                    document.getElementById("errorMessage").style.display = "block";
                }
            } catch (error) {
                document.getElementById("errorMessage").innerText =
                    "Problème au niveau du serveur";
                document.getElementById("errorMessage").style.display = "block";
            }
        });
    }
});

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    console.log("User logged out - Redirecting to login");
    window.location.href = "/";
}
