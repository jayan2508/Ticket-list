document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const emailErrorElement = document.getElementById("emailError");
    const passwordErrorElement = document.getElementById("passwordError");

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(loginForm);
        const enteredEmail = formData.get("email").trim(); 
        const enteredPassword = formData.get("password").trim();

        const users = JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find((user) => user.email === enteredEmail);

        emailErrorElement.textContent = "";
        passwordErrorElement.textContent = "";

        if (!enteredEmail || !enteredPassword) {
            if (!enteredEmail) {
                emailErrorElement.textContent = "Please enter your email.";
            }
            if (!enteredPassword) {
                passwordErrorElement.textContent = "Please enter your password.";
            }
            return;
        }

        if (!user) {
            emailErrorElement.textContent = "User not found. Please check your email.";
        } else if (user.password !== enteredPassword) {
            passwordErrorElement.textContent = "Incorrect password. Please try again.";
        } else {
            loginForm.reset();
            const role = user.role;
            const firstName = user.firstName;
            const lastName = user.lastName;
            window.location.href = `header.html?role=${encodeURIComponent(role)}&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`;
        }
    });

    const emailInput = loginForm.querySelector('input[name="email"]');
    const passwordInput = loginForm.querySelector('input[name="password"]');
    
    emailInput.addEventListener('input', () => {
        emailErrorElement.textContent = "";
    });
    
    passwordInput.addEventListener('input', () => {
        passwordErrorElement.textContent = "";
    });

    const cancelButton = document.getElementById("cancelButton");

    cancelButton.addEventListener("click", function () {
        document.getElementById("emailError").innerHTML = "";
        document.getElementById("passwordError").innerHTML = "";
    });
});

var passwordEye;
function pass() {
    if (passwordEye === 1) {
        document.getElementById("password").type = 'password';
        document.getElementById("pass-icon").src = 'eye-hide.png';
        passwordEye = 0;
    } else {
        document.getElementById("password").type = 'text';
        document.getElementById("pass-icon").src = 'eye.png';
        passwordEye = 1;
    }
}