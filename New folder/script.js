const products = [
  {
    id: 1,
    name: "SAMSUNG TV",
    price: 500000,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80"
  },
  {
    id: 2,
    name: "PIXEL 4a",
    price: 250000,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80"
  },
  {
    id: 3,
    name: "PS 5",
    price: 800000,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80"
  },
  {
    id: 4,
    name: "MACBOOK AIR",
    price: 800000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80"
  },
  {
    id: 5,
    name: "APPLE WATCH",
    price: 95000,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80"
  },
  {
    id: 6,
    name: "AIR PODS",
    price: 75000,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&q=80"
  }
];

let cart = [];

const productsGrid = document.getElementById("products-grid");
const cartBtn = document.getElementById("cart-btn");
const cartCount = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartTotalEl = document.getElementById("cart-total");
const continueBtn = document.getElementById("continue-btn");
const checkoutBtn = document.getElementById("checkout-btn");

const nameInput = document.getElementById("user-name");
const emailInput = document.getElementById("user-email");
const phoneInput = document.getElementById("user-phone");
const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const phoneError = document.getElementById("phone-error");

const summaryModal = document.getElementById("summary-modal");
const summaryGreeting = document.getElementById("summary-greeting");
const summaryBody = document.getElementById("summary-body");
const summaryOkBtn = document.getElementById("summary-ok-btn");

function formatMoney(amount) {
  return `₦${amount.toLocaleString()}`;
}

function renderProducts() {
  productsGrid.innerHTML = products
    .map((product) => {
      const inCart = cart.some((item) => item.id === product.id);
      return `
        <div class="product-card" data-id="${product.id}">
          <div class="product-img-wrap">
            <img src="${product.image}" alt="${product.name}" />
            <div class="price-overlay">
              <span>Price</span>
              <strong>${formatMoney(product.price)}</strong>
            </div>
          </div>
          <p class="product-title">${product.name}</p>
          <button
            class="card-btn ${inCart ? "in-cart" : ""}"
            onclick="toggleCartItem(${product.id})"
          >
            ${inCart ? "REMOVE FROM CART" : "ADD TO CART"}
          </button>
        </div>
      `;
    })
    .join("");
}

function toggleCartItem(productId) {
  const existingIndex = cart.findIndex((item) => item.id === productId);

  if (existingIndex > -1) {
    cart.splice(existingIndex, 1);
  } else {
    const product = products.find((p) => p.id === productId);
    cart.push({ ...product, quantity: 1 });
  }

  updateUI();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateUI();
}

function changeQuantity(productId, delta) {
  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    updateUI();
  }
}

function calculateTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function updateUI() {
  cartCount.textContent = cart.length;
  renderProducts();
  renderCartModal();
}

function renderCartModal() {
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p style="text-align:center; padding:1rem;">Your cart is currently empty.</p>`;
    cartTotalEl.textContent = formatMoney(0);
    return;
  }

  cartItemsContainer.innerHTML = `
    <table class="cart-table">
      <thead>
        <tr>
          <th>S/N</th>
          <th>Item</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${cart
          .map(
            (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${formatMoney(item.price * item.quantity)}</td>
            <td>
              <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
              <span style="margin: 0 8px; font-weight: 700;">${item.quantity}</span>
              <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
            </td>
            <td>
              <button class="remove-row-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;

  cartTotalEl.textContent = formatMoney(calculateTotal());
}

cartBtn.addEventListener("click", () => {
  renderCartModal();
  cartModal.classList.add("active");
});

continueBtn.addEventListener("click", () => {
  cartModal.classList.remove("active");
});

cartModal.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    cartModal.classList.remove("active");
  }
});

function validateName() {
  const val = nameInput.value.trim();
  if (!val) {
    nameError.textContent = "Name cannot be empty.";
    nameInput.classList.add("invalid");
    return false;
  }
  nameError.textContent = "";
  nameInput.classList.remove("invalid");
  return true;
}

function validateEmail() {
  const val = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!val) {
    emailError.textContent = "Email cannot be empty.";
    emailInput.classList.add("invalid");
    return false;
  }
  if (!emailRegex.test(val)) {
    emailError.textContent = "Please enter a valid email address.";
    emailInput.classList.add("invalid");
    return false;
  }
  emailError.textContent = "";
  emailInput.classList.remove("invalid");
  return true;
}

function validatePhone() {
  const val = phoneInput.value.trim();
  const digitsOnly = val.replace(/\D/g, "");
  if (!val) {
    phoneError.textContent = "Phone number cannot be empty.";
    phoneInput.classList.add("invalid");
    return false;
  }
  if (digitsOnly.length < 10 || digitsOnly.length > 14) {
    phoneError.textContent = "Phone number must be between 10 and 14 digits.";
    phoneInput.classList.add("invalid");
    return false;
  }
  phoneError.textContent = "";
  phoneInput.classList.remove("invalid");
  return true;
}

nameInput.addEventListener("blur", validateName);
emailInput.addEventListener("blur", validateEmail);
phoneInput.addEventListener("blur", validatePhone);

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Please add at least one item to your cart before checking out.");
    return;
  }

  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isPhoneValid = validatePhone();

  if (!isNameValid || !isEmailValid || !isPhoneValid) {
    return;
  }

  const customerName = nameInput.value.trim();
  const customerEmail = emailInput.value.trim();
  const totalAmount = calculateTotal();

  cartModal.classList.remove("active");

  if (typeof PaystackPop === "undefined") {
    alert("Paystack script failed to load. Check your internet connection.");
    return;
  }

  const handler = PaystackPop.setup({
    key: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxx",
    email: customerEmail,
    amount: totalAmount * 100,
    currency: "NGN",
    callback: function () {
      showSummaryModal(customerName);
    },
    onClose: function () {
      alert("Payment window closed.");
    }
  });

  handler.openIframe();
});

function showSummaryModal(customerName) {
  summaryGreeting.textContent = `Thank You, ${customerName}, Your Order has been Received`;
  summaryBody.innerHTML = cart
    .map(
      (item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
      </tr>
    `
    )
    .join("");

  summaryModal.classList.add("active");
}

summaryOkBtn.addEventListener("click", () => {
  summaryModal.classList.remove("active");
  window.location.reload();
});

renderProducts();
