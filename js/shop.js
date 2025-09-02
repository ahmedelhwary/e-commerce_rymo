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
  ["img/shop/1.webp", "img/shop/2.webp", "img/shop/3.webp", "img/shop/1.webp"],
  ["img/shop/4.webp", "img/shop/5.webp", "img/shop/6.webp", "img/shop/4.webp"],
  ["img/shop/7.webp", "img/shop/8.webp", "img/shop/9.webp", "img/shop/7.webp"],
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
  [
    "img/shop/20.webp",
    "img/shop/21.webp",
    "img/shop/22.webp",
    "img/shop/20.webp",
  ],
  [
    "img/shop/23.webp",
    "img/shop/24.webp",
    "img/shop/25.webp",
    "img/shop/23.webp",
  ],
  [
    "img/shop/26.webp",
    "img/shop/27.webp",
    "img/shop/28.webp",
    "img/shop/29.webp",
  ],
  ["img/shop/30.webp"],
  ["img/shop/31.webp"],
  ["img/shop/32.webp"],
  ["img/shop/33.webp"],
  ["img/shop/34.webp"],
];

// Pagination logic
const PRODUCTS_PER_PAGE = 8;
let currentPage = parseInt(localStorage.getItem("shopPage") || "1");

function renderProducts(page) {
  const allProducts = Array.from(document.querySelectorAll(".product"));
  allProducts.forEach((el, idx) => {
    if (
      idx >= (page - 1) * PRODUCTS_PER_PAGE &&
      idx < page * PRODUCTS_PER_PAGE
    ) {
      el.style.display = "";
    } else {
      el.style.display = "none";
    }
  });

  const pagination = document.querySelector(".pagination");
  if (pagination) {
    const pageItems = pagination.querySelectorAll("li.page-item");
    let totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
    pageItems.forEach((li) => li.classList.remove("active"));
    if (pageItems.length > 2 + (totalPages - 1)) {
      pageItems[page].classList.add("active");
    } else {
      pageItems[page - 1].classList.add("active");
    }
    if (page === 1) {
      pageItems[0].classList.add("disabled");
    } else {
      pageItems[0].classList.remove("disabled");
    }
    if (page === totalPages) {
      pageItems[pageItems.length - 1].classList.add("disabled");
    } else {
      pageItems[pageItems.length - 1].classList.remove("disabled");
    }
  }
}
renderProducts(currentPage);

// Pagination buttons
const pagination = document.querySelector(".pagination");
if (pagination) {
  const pageLinks = pagination.querySelectorAll(".page-link");
  pageLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      let text = link.textContent.trim().toLowerCase();
      let totalPages = Math.ceil(
        document.querySelectorAll(".product").length / PRODUCTS_PER_PAGE
      );
      let isPrev = text === "previous";
      let isNext = text === "next";
      let isNumber = !isNaN(Number(text));
      let shouldScroll = false;
      if (isNext && currentPage < totalPages) {
        currentPage++;
        shouldScroll = true;
      } else if (isPrev && currentPage > 1) {
        currentPage--;
        shouldScroll = true;
      } else if (isNumber && Number(text) !== currentPage) {
        currentPage = Number(text);
        shouldScroll = true;
      } else {
        return;
      }
      localStorage.setItem("shopPage", currentPage);
      renderProducts(currentPage);
      if (shouldScroll) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
}

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

// add product in cart
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
});

// slider
let slideIndex = 0;
function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
    slides[i].style.opacity = 0;
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex - 1].style.display = "block";
  slides[slideIndex - 1].style.opacity = 1;
  slides[slideIndex - 1].style.pointerEvents = "auto";
  dots[slideIndex - 1].className += " active";
  setTimeout(showSlides, 3000);
}
showSlides();

// filteration
document.addEventListener("DOMContentLoaded", function () {
  const labels = document.querySelectorAll(
    "#category-labels-bar .category-label"
  );
  const products = document.querySelectorAll(".product");
  const pagination = document.querySelector(".pagination");

  labels.forEach((label) => {
    label.addEventListener("click", function () {
      labels.forEach((l) => l.classList.remove("active"));
      label.classList.add("active");

      const cat = label.getAttribute("data-category");

      products.forEach((prod) => {
        const prodCat = prod.getAttribute("data-category");
        if (cat === "all" || prodCat === cat) {
          prod.style.display = "";
        } else {
          prod.style.display = "none";
        }
      });

      if (pagination) pagination.style.display = "none";
    });
  });
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
