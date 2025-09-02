document.addEventListener("DOMContentLoaded", function () {
  //(PROCEED TO CHECKOUT)
  const checkoutBtn = document.querySelector(".total .buy-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const userEmail = localStorage.getItem("currentUser");
      let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
      if (userEmail) {
        allCarts[userEmail] = [];
        localStorage.setItem("allCarts", JSON.stringify(allCarts));
      }
      localStorage.removeItem("couponValue");
      const tbody = document.querySelector("#cart-container tbody");
      if (tbody) tbody.innerHTML = "";
      if (typeof window.updateCartCount === "function")
        window.updateCartCount();

      const subtotalEl = document.querySelector(
        ".total .d-flex:nth-child(3) p"
      );
      const shippingEl = document.querySelector(
        ".total .d-flex:nth-child(2) p"
      );
      const ttotalEl = document.querySelector(".total .d-flex:nth-child(5) p");
      const totalEl = document.querySelector(".total .d-flex:last-child p");
      if (subtotalEl) subtotalEl.textContent = "$0.00";
      if (shippingEl) shippingEl.textContent = "$0.00";
      if (ttotalEl) ttotalEl.textContent = "$0.00";
      if (totalEl) totalEl.textContent = "$0.00";

      // SweetAlert
      if (window.Swal) {
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: "Your order has been placed successfully!",
        });
      } else {
        alert("Successful! Your order has been placed successfully!");
      }
      if (typeof renderCart === "function") renderCart();
    });
  }

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

document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("#cart-container tbody");
  const paginationEls = {
    subtotal: document.querySelector(".total .d-flex:nth-child(3) p"),
    shipping: document.querySelector(".total .d-flex:nth-child(2) p"),
    ttotal: document.querySelector(".total .d-flex:nth-child(5) p"),
    total: document.querySelector(".total .d-flex:last-child p"),
  };

  const getUserEmail = () => localStorage.getItem("currentUser");
  const getAllCarts = () => JSON.parse(localStorage.getItem("allCarts")) || {};
  const saveAllCarts = (carts) =>
    localStorage.setItem("allCarts", JSON.stringify(carts));

  function renderCart() {
    const userEmail = getUserEmail();
    const allCarts = getAllCarts();
    const cart = userEmail ? allCarts[userEmail] || [] : [];
    tbody.innerHTML = "";

    let total = 0;
    cart.forEach((item, idx) => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;
      tbody.innerHTML += `
        <tr>
          <td><a href="#" class="remove" data-idx="${idx}"><i class="fas fa-trash-alt"></i></a></td>
          <td><img src="${item.img}" width="50"></td>
          <td><h5>${item.name}</h5></td>
          <td><h5>$${item.price}</h5></td>
          <td><input class="w-25 ps-1 qty-input" type="number" min="1" value="${
            item.qty
          }" data-idx="${idx}" /></td>
          <td><h5>$${itemTotal.toFixed(2)}</h5></td>
        </tr>
      `;
    });

    let discount = 0;
    const coupon = parseFloat(localStorage.getItem("couponValue") || 0);
    if (coupon) discount = total * (coupon / 100);

    const subtotal = total - discount;
    if (paginationEls.subtotal)
      paginationEls.subtotal.textContent = "$" + subtotal.toFixed(2);
    if (paginationEls.ttotal)
      paginationEls.ttotal.textContent = "$" + subtotal.toFixed(2);
    if (paginationEls.shipping)
      paginationEls.shipping.textContent = "$" + total.toFixed(2);
    if (paginationEls.total)
      paginationEls.total.textContent = "$" + subtotal.toFixed(2);
  }

  // تفعيل الكوبون
  const couponBtn = document.querySelector(".coupon .buy-btn");
  if (couponBtn) {
    couponBtn.addEventListener("click", () => {
      const input = document.querySelector('.coupon input[type="text"]');
      const code = input.value.trim().toLowerCase();
      const coupons = { discount10: 10 }; // تقدر تزود هنا
      const percent = coupons[code] || 0;

      if (percent) {
        localStorage.setItem("couponValue", percent);
        window.Swal
          ? Swal.fire("Coupon Applied", "Discount " + percent + "%", "success")
          : alert("Coupon applied successfully! Discount " + percent + "%");
      } else {
        localStorage.removeItem("couponValue");
        window.Swal
          ? Swal.fire("Error", "Coupon is invalid or expired", "error")
          : alert("Coupon is invalid or expired");
      }
      renderCart();
    });
  }

  // تغيير الكمية + الحذف (delegation)
  tbody.addEventListener("input", (e) => {
    if (e.target.classList.contains("qty-input")) {
      const idx = e.target.dataset.idx;
      const userEmail = getUserEmail();
      const allCarts = getAllCarts();
      const cart = allCarts[userEmail] || [];
      let newQty = Math.max(1, parseInt(e.target.value) || 1);
      cart[idx].qty = newQty;
      allCarts[userEmail] = cart;
      saveAllCarts(allCarts);
      renderCart();
      window.updateCartCount?.();
    }
  });

  tbody.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".remove");
    if (removeBtn) {
      const idx = removeBtn.dataset.idx;
      const userEmail = getUserEmail();
      const allCarts = getAllCarts();
      const cart = allCarts[userEmail] || [];
      cart.splice(idx, 1);
      allCarts[userEmail] = cart;
      saveAllCarts(allCarts);
      renderCart();
      window.updateCartCount?.();
    }
  });

  // navbar
  const userMenu = document.getElementById("user-menu");
  const loginMenu = document.getElementById("login-menu");
  const fullnameSpan = document.getElementById("navbar-fullname");
  const usernameSpan = document.getElementById("navbar-username");
  const signoutBtn = document.getElementById("signout-btn");

  const userEmail = getUserEmail();
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
    signoutBtn.onclick = (e) => {
      e.preventDefault();
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("currentUser");
      location.href = "login.html";
    };
  }

  renderCart();
});

// slider
let slideIndex = 0;
showSlides();

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
