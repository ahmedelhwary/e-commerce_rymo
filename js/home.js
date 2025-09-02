document.addEventListener("DOMContentLoaded", function () {
  const products = document.querySelectorAll(".product");

  const productImages = [
    [
      "img/featured/5.webp",
      "img/featured/2.webp",
      "img/featured/3.webp",
      "img/featured/5.webp",
    ],
    [
      "img/featured/9.webp",
      "img/featured/4.webp",
      "img/featured/12.webp",
      "img/featured/9.webp",
    ],
    [
      "img/featured/8.webp",
      "img/featured/11.webp",
      "img/featured/14.webp",
      "img/featured/8.webp",
    ],
    [
      "img/featured/7.webp",
      "img/featured/10.webp",
      "img/featured/13.webp",
      "img/featured/7.webp",
    ],
    [
      "img/shop/1.webp",
      "img/shop/2.webp",
      "img/shop/3.webp",
      "img/shop/1.webp",
    ],
    [
      "img/shop/4.webp",
      "img/shop/5.webp",
      "img/shop/6.webp",
      "img/shop/4.webp",
    ],
    [
      "img/shop/7.webp",
      "img/shop/8.webp",
      "img/shop/9.webp",
      "img/shop/7.webp",
    ],
    [
      "img/shop/10.webp",
      "img/shop/11.webp",
      "img/shop/12.webp",
      "img/shop/10.webp",
    ],
    ["img/watches/1.jpg"],
    ["img/watches/2.jpg"],
    ["img/watches/3.jpg"],
    ["img/watches/4.jpg"],
    ["img/shoes/5.jpg"],
    ["img/shoes/6.jpg"],
    ["img/shoes/7.jpg"],
    ["img/shoes/8.jpg"],
  ];

  products.forEach((product, idx) => {
    product.addEventListener("click", function () {
      const img = product.querySelector("img").getAttribute("src");
      const name = product.querySelector(".p-name").textContent;
      const price = product.querySelector(".p-price").textContent;
      const images = productImages[idx] || [img];
      const details = { img, name, price, images, id: idx + 1 };
      localStorage.setItem("selectedProduct", JSON.stringify(details));
      window.location.href = "sproduct.html";
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const buyBtns = document.querySelectorAll(".buy-btn");
  buyBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const product = btn.closest(".product");
      const img = product.querySelector("img").getAttribute("src");
      const name = product.querySelector(".p-name").textContent;
      const price = parseFloat(
        product.querySelector(".p-price").textContent.replace("$", "")
      );
      const userEmail = localStorage.getItem("currentUser");
      if (!userEmail) {
        if (window.Swal) {
          Swal.fire({
            icon: "warning",
            title: "warning",
            text: "You must log in first!",
          }).then(function () {
            window.location.href = "login.html";
          });
        } else {
          alert("You must log in first!");
          window.location.href = "login.html";
        }
        return;
      }
      let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
      let cart = allCarts[userEmail] || [];
      const found = cart.find((item) => item.name === name && item.img === img);
      if (found) {
        found.qty += 1;
      } else {
        cart.push({ name, img, price, qty: 1 });
      }
      allCarts[userEmail] = cart;
      localStorage.setItem("allCarts", JSON.stringify(allCarts));
      updateCartCount();
    });
  });
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
  window.updateCartCount();
});

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

//  go to shop by button
document.addEventListener("DOMContentLoaded", function () {
  var shopNowBtns = document.querySelectorAll(".shop-now-btn");
  shopNowBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      window.location.href = "shop.html";
    });
  });
});
