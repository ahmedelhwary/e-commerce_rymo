// add to cart button
document.addEventListener("DOMContentLoaded", function () {
  const addToCartBtn = document.getElementById("add-to-cart-btn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const product = JSON.parse(localStorage.getItem("selectedProduct"));
      if (!product) return;
      let qty = 1;
      const qtyInput = document.querySelector(
        "#product-qty, .product-qty, input[type='number'].qty-input"
      );
      if (qtyInput && !isNaN(parseInt(qtyInput.value))) {
        qty = Math.max(1, parseInt(qtyInput.value));
      }
      const userEmail = localStorage.getItem("currentUser");
      if (!userEmail) {
        if (window.Swal) {
          Swal.fire({
            icon: "warning",
            title: "Warning",
            text: "You must be logged in first!",
          }).then(function () {
            window.location.href = "login.html";
          });
        } else {
          alert("You must be logged in first!");
          window.location.href = "login.html";
        }
        return;
      }
      let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
      let cart = allCarts[userEmail] || [];
      const found = cart.find(
        (item) => item.name === product.name && item.img === product.img
      );
      if (found) {
        found.qty += qty;
      } else {
        cart.push({
          name: product.name,
          img: product.img,
          price: parseFloat(product.price.replace("$", "")),
          qty: qty,
        });
      }
      allCarts[userEmail] = cart;
      localStorage.setItem("allCarts", JSON.stringify(allCarts));
      if (typeof window.updateCartCount === "function")
        window.updateCartCount();
      if (window.Swal) {
        Swal.fire({
          icon: "success",
          title: "Added to Cart",
          text: "Product has been added to your cart!",
        });
      } else {
        alert("Product has been added to your cart!");
      }
    });
  }
  // Sproduct Change Image Details
  const product = JSON.parse(localStorage.getItem("selectedProduct"));
  if (product) {
    const mainImg = document.getElementById("MainImg");
    if (mainImg) mainImg.src = product.img;
    const nameEl = document.querySelector(".sproduct h3");
    if (nameEl) nameEl.textContent = product.name;
    const priceEl = document.querySelector(".sproduct h2");
    if (priceEl) priceEl.textContent = product.price;

    const smallImgGroup = document.querySelector(".small-img-group");
    if (smallImgGroup && product.images) {
      smallImgGroup.innerHTML = "";
      product.images.forEach((src) => {
        const col = document.createElement("div");
        col.className = "small-img-col";
        const img = document.createElement("img");
        img.className = "small-img";
        img.src = src;
        img.style.width = "100%";
        img.alt = "";
        img.addEventListener("click", function () {
          const mainImg = document.getElementById("MainImg");
          if (mainImg) mainImg.src = src;
        });
        col.appendChild(img);
        smallImgGroup.appendChild(col);
      });
    }
  }
});

// create counter cart in navbar
window.updateCartCount = function () {
  const userEmail = localStorage.getItem("currentUser");
  let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
  let cart = userEmail ? allCarts[userEmail] || [] : [];
  let count = cart.reduce((sum, item) => sum + item.qty, 0);
  let cartIcon = document.querySelector(".fa-bag-shopping");
  if (cartIcon) {
    let badge = cartIcon.parentElement.querySelector(".cart-count-badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "cart-count-badge";
      badge.style.position = "absolute";
      badge.style.top = "-8px";
      badge.style.right = "-8px";
      badge.style.background = "red";
      badge.style.color = "white";
      badge.style.borderRadius = "50%";
      badge.style.padding = "2px 7px";
      badge.style.fontSize = "12px";
      badge.style.zIndex = "10";
      cartIcon.parentElement.style.position = "relative";
      cartIcon.parentElement.appendChild(badge);
    }
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline-block" : "none";
  }
};
// update counter cart icon when we reload page
window.updateCartCount();

// عرض اسم المستخدم في الـ navbar
document.addEventListener("DOMContentLoaded", function () {
  const userMenu = document.getElementById("user-menu");
  const loginMenu = document.getElementById("login-menu");
  const fullnameSpan = document.getElementById("navbar-fullname");
  const usernameSpan = document.getElementById("navbar-username");
  const signoutBtn = document.getElementById("signout-btn");
  const userEmail = localStorage.getItem("currentUser");
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === userEmail);
  if (user) {
    userMenu.style.display = "";
    loginMenu.style.display = "none";
    fullnameSpan.textContent = user.fullname;
    usernameSpan.textContent = "Username: " + user.username;
  } else {
    userMenu.style.display = "none";
    loginMenu.style.display = "";
  }
  if (signoutBtn) {
    signoutBtn.onclick = function (e) {
      e.preventDefault();
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("currentUser");
      window.location.href = "login.html";
    };
  }
});
