document.addEventListener("DOMContentLoaded", function () {
    const registrationForm = document.getElementById("registrationForm");
    const firstNameInput = document.getElementById("firstName");
    const lastNameInput = document.getElementById("lastName");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const roleInput = document.getElementById("role");
    let users = JSON.parse(localStorage.getItem("users")) || [];

    registrationForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let hasValidationErrors = false;

        if (!firstNameInput.value.trim()) {
            document.getElementById("firstNameError").innerHTML = "Please enter your first name";
            hasValidationErrors = true;
        }

        if (!lastNameInput.value.trim()) {
            document.getElementById("lastNameError").innerHTML = "Please enter your last name";
            hasValidationErrors = true;
        }

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            document.getElementById("emailError").innerHTML = "Please enter a valid email address.";
            hasValidationErrors = true;
        }

        if (!passwordInput.value.trim()) {
            document.getElementById("passwordError").innerHTML = "Please enter a password";
            hasValidationErrors = true;
        }

        const isEmailUnique = users.every((user) => user.email !== emailInput.value.trim());
        if (!isEmailUnique) {
            document.getElementById("emailError").innerHTML = "Email already exists. Please choose another email.";
            hasValidationErrors = true;
        }

        if (hasValidationErrors) {
            return;
        }

        const userData = {
            firstName: firstNameInput.value.trim(),
            lastName: lastNameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value.trim(),
            role: roleInput.value,
        };

        users.push(userData);
        localStorage.setItem("users", JSON.stringify(users));

        registrationForm.reset();

        window.location.href = "login.html";
    });

    firstNameInput.addEventListener('input', () => {
        document.getElementById("firstNameError").innerHTML = "";
    });

    lastNameInput.addEventListener('input', () => {
        document.getElementById("lastNameError").innerHTML = "";
    });

    emailInput.addEventListener('input', () => {
        document.getElementById("emailError").innerHTML = "";
    });

    passwordInput.addEventListener('input', () => {
        document.getElementById("passwordError").innerHTML = "";
    });

    const cancelButton = document.getElementById("cancelButton");

    cancelButton.addEventListener("click", function () {
        document.getElementById("firstNameError").innerHTML = "";
        document.getElementById("lastNameError").innerHTML = "";
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