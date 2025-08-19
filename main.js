// Lấy giỏ hàng từ localStorage
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

// ----------------- Add to cart -----------------
function addToCart(productCard) {
  const name = productCard.querySelector(".product-title").textContent;
  const priceText = productCard.querySelector(".product-price").textContent;
  const price = parseFloat(priceText.replace("$", ""));
  const imgSrc = productCard.querySelector(".product-img").src;

  const existingItem = cartItems.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({
      name,
      price,
      quantity: 1,
      image: imgSrc,
    });
  }
  updateLocalStorage();
  updateCartCount();
  showToast(`${name} added to cart`);
}

// ----------------- Hiển thị giỏ hàng (trang cart.html) -----------------
function displayCartItems() {
  const cartContainer = document.getElementById("cartItems");
  const totalElement = document.getElementById("cartTotal");
  if (cartContainer) {
    cartContainer.innerHTML = "";
    let total = 0;
    cartItems.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <div class="cart-title-price">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
        </div>
        <div class="quantity-controls">
          <button onclick="changeQuantity('${item.name}',-1)">
            <i class="ri-subtract-line"></i>
          </button>
          <input
            type="text"
            class="cart-item-quantity"
            value="${item.quantity}"
            min="1"
            onchange="updateQuantity('${item.name}',this.value)"
          />
          <button onclick="changeQuantity('${item.name}',1)">
            <i class="ri-add-line"></i>
          </button>
          <div class="remove-from-cart" onclick="removeItem('${item.name}')">
            <i class="ri-delete-bin-line"></i>
          </div>
        </div>`;
      cartContainer.appendChild(cartItem);
    });
    if (totalElement) {
      totalElement.textContent = `Total: $${total.toFixed(2)}`;
    }
  }
}

// ----------------- Cập nhật localStorage -----------------
function updateLocalStorage() {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// ----------------- Cập nhật số lượng trên icon giỏ hàng -----------------
function updateCartCount() {
  const countElement = document.getElementById("cart-count");
  if (countElement) {
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    countElement.textContent = totalCount;
  }
}

// ----------------- Các thao tác trên giỏ hàng -----------------
function changeQuantity(name, delta) {
  const item = cartItems.find((i) => i.name === name);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      cartItems = cartItems.filter((i) => i.name !== name);
    }
    updateLocalStorage();
    displayCartItems();
    updateCartCount();
  }
}

function updateQuantity(name, newQuantity) {
  const item = cartItems.find((i) => i.name === name);
  if (item) {
    item.quantity = parseInt(newQuantity) || 1;
    updateLocalStorage();
    displayCartItems();
    updateCartCount();
  }
}

function removeItem(name) {
  cartItems = cartItems.filter((i) => i.name !== name);
  updateLocalStorage();
  displayCartItems();
  updateCartCount();
}

// ----------------- Load khi vào trang -----------------
window.onload = function () {
  if (document.getElementById("cartItems")) {
    displayCartItems();
  }
  createToastContainer();
};
// thong bao chuc mung

function createToastContainer() {
  if (document.getElementById("toast-container")) return;
  const toastContainer = document.createElement("div");
  toastContainer.id = "toast-container";
  toastContainer.className = "toast-container";
  document.body.appendChild(toastContainer);
}
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  const container = document.getElementById("toast-container");
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("toast-show");
  }, 100);
  // xoa sau 3s
  setTimeout(() => {
    toast.classList.remove("toast-show");
    setTimeout(() => {
      if (container.contains(toast)) {
        container.removeChild(toast);
      }
    }, 300);
  }, 3000);
}
