// login.js

function showSignup() {
  document.getElementById("login-box").style.display = "none";
  document.getElementById("signup-box").style.display = "block";
}
function showLogin() {
  document.getElementById("signup-box").style.display = "none";
  document.getElementById("login-box").style.display = "block";
}

function signup() {
  const fullname = document.getElementById("signup-fullname").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const username = document.getElementById("signup-username").value.trim();
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById(
    "signup-confirm-password"
  ).value;
  if (!fullname || !email || !username || !password || !confirmPassword) {
    Swal.fire({
      icon: "warning",
      title: "Missing Fields",
      text: "Please fill in all fields",
    });
    return;
  }
  if (!validatePassword(password)) {
    Swal.fire({
      icon: "error",
      title: "Weak Password",
      text: "Password must be at least 6 digits and contain at least one letter.",
    });
    return;
  }
  // Password must be at least 6 digits and contain at least one letter
  function validatePassword(password) {
    const hasLetter = /[a-zA-Z]/.test(password);
    const digits = password.replace(/[^0-9]/g, "");
    return hasLetter && digits.length >= 6;
  }
  // Show/hide password functionality
  function togglePasswordVisibility(id, iconId) {
    const input = document.getElementById(id);
    const icon = document.getElementById(iconId);
    if (input.type === "password") {
      input.type = "text";
      if (icon) icon.classList.remove("fa-eye");
      if (icon) icon.classList.add("fa-eye-slash");
    } else {
      input.type = "password";
      if (icon) icon.classList.remove("fa-eye-slash");
      if (icon) icon.classList.add("fa-eye");
    }
  }
  togglePasswordVisibility();
  if (!validateEmail(email)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Email",
      text: "Please enter a valid email address",
    });
    return;
  }
  if (password !== confirmPassword) {
    Swal.fire({
      icon: "error",
      title: "Password Mismatch",
      text: "Passwords do not match",
    });
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.find((u) => u.email === email)) {
    Swal.fire({
      icon: "error",
      title: "Email Exists",
      text: "Email already registered",
    });
    return;
  }
  if (users.find((u) => u.username === username)) {
    Swal.fire({
      icon: "error",
      title: "Username Exists",
      text: "Username already exists",
    });
    return;
  }
  users.push({ fullname, email, username, password });
  localStorage.setItem("users", JSON.stringify(users));
  Swal.fire({
    icon: "success",
    title: "Sign up successful!",
    text: "Please login.",
  }).then(() => {
    showLogin();
  });
}

function validateEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", user.email);
    window.location.href = "index.html";
  } else {
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: "Invalid username or password",
    });
  }
  function updateLoginLogoutLink() {
    var loginLink = document.getElementById("login-link");
    if (!loginLink) return;
    if (localStorage.getItem("isLoggedIn") === "true") {
      loginLink.textContent = "Logout";
      loginLink.onclick = function (e) {
        e.preventDefault();
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
      };
      loginLink.href = "#";
    } else {
      loginLink.textContent = "Login/Sign up";
      loginLink.onclick = null;
      loginLink.href = "login.html";
    }
  }
  document.addEventListener("DOMContentLoaded", updateLoginLogoutLink);
  window.addEventListener("storage", updateLoginLogoutLink);
}
