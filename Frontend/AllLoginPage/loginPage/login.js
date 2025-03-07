function login() {
    let email = document.getElementById("login-username").value.trim();
    let password = document.getElementById("login-password").value.trim();
    let loginMessage = document.getElementById("login-message");

    // Retrieve stored user data from localStorage
    let storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
        loginMessage.textContent = "No account found. Please sign up first.";
        loginMessage.style.color = "red";
        return;
    }

    // Validate credentials
    if (email === storedUser.email && password === storedUser.password) {
        loginMessage.textContent = "Login successful! Redirecting...";
        loginMessage.style.color = "green";

        // Store session data
        localStorage.setItem("isLoggedIn", "true");

        // Redirect to dashboard or homepage after 2 seconds
        setTimeout(() => {
            window.location.href = "index.html"; // Change this as needed
        }, 2000);
    } else {
        loginMessage.textContent = "Invalid email or password!";
        loginMessage.style.color = "red";
    }
}


document.getElementById("togglePassword").addEventListener("click", function () {
    let passwordInput = document.getElementById("signup-password");
    let icon = this;

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
});
