const WHATSAPP_NUMBER = "57XXXXXXXXXX"; // Cambia este número. Ejemplo Colombia: "573001234567"
const INSTAGRAM_URL = "https://www.instagram.com/tuusuario";
const BUSINESS_NAME = "Espíritu Floral";
const CART_STORAGE_KEY = "espiritu_floral_cart_v1";
const CART_EXTRA_STORAGE_KEY = "espiritu_floral_cart_extra_v1";

// ===========================================================================
// CATÁLOGO DE PRODUCTOS
// CAMBIAR: edita aquí nombre, precio, descripción, imagen, etiqueta (tag),
// medida y disponibilidad (stock) de cada producto.
//   - "medida": tamaño aproximado. Si aún no lo sabes, deja "Medida por confirmar".
//   - "stock": "Disponible", "Pocas unidades", "Por encargo" o "Consultar disponibilidad".
// No inventes medidas reales: usa los textos por confirmar mientras no tengas el dato.
// ===========================================================================
const products = [
  {
    id: 1,
    name: "Suculenta Mini Aura",
    category: "Suculentas individuales",
    price: 18000,
    description: "Suculenta pequeña en matera decorativa, ideal para escritorios y repisas.",
    image: "assets/productos/suculenta-mini-aura.svg",
    tag: "Ideal para regalo",
    medida: "Medida por confirmar",
    stock: "Disponible",
    featured: true
  },
  {
    id: 2,
    name: "Matera Terracota Serena",
    category: "Materas decorativas",
    price: 26000,
    description: "Matera estilo terracota para dar un toque cálido y natural a cualquier rincón.",
    image: "assets/productos/matera-terracota-serena.svg",
    tag: "Nuevo",
    medida: "Medida por confirmar",
    stock: "Disponible",
    featured: false
  },
  {
    id: 3,
    name: "Combo Verde Calma",
    category: "Combos regalo",
    price: 45000,
    description: "Combo decorativo con suculenta, matera y empaque sencillo para regalo.",
    image: "assets/productos/combo-verde-calma.svg",
    tag: "Más vendido",
    medida: "Medida por confirmar",
    stock: "Pocas unidades",
    featured: true
  },
  {
    id: 4,
    name: "Mini Jardín Bruma",
    category: "Mini jardines",
    price: 62000,
    description: "Composición pequeña con varias suculentas, piedras decorativas y matera amplia.",
    image: "assets/productos/mini-jardin-bruma.svg",
    tag: "Premium",
    medida: "Medida por confirmar",
    stock: "Por encargo",
    featured: true
  },
  {
    id: 5,
    name: "Kit Cuida Tu Suculenta",
    category: "Kits de cuidado",
    price: 32000,
    description: "Kit básico con atomizador, guía de cuidado y elementos decorativos para mantenimiento.",
    image: "assets/productos/kit-cuidado.svg",
    tag: "Práctico",
    medida: "Medida por confirmar",
    stock: "Disponible",
    featured: false
  },
  {
    id: 6,
    name: "Suculenta Escritorio Vivo",
    category: "Suculentas individuales",
    price: 22000,
    description: "Una opción compacta para darle vida a escritorios, mesas de noche o espacios de trabajo.",
    image: "assets/productos/suculenta-escritorio-vivo.svg",
    tag: "Oficina",
    medida: "Medida por confirmar",
    stock: "Disponible",
    featured: false
  },
  {
    id: 7,
    name: "Combo Dulce Jardín",
    category: "Combos regalo",
    price: 52000,
    description: "Detalle verde con empaque especial y opción de mensaje para tarjeta.",
    image: "assets/productos/combo-dulce-jardin.svg",
    tag: "Regalo",
    medida: "Medida por confirmar",
    stock: "Disponible",
    featured: true
  },
  {
    id: 8,
    name: "Matera Blanca Nube",
    category: "Materas decorativas",
    price: 24000,
    description: "Matera blanca minimalista, perfecta para decoraciones limpias y modernas.",
    image: "assets/productos/matera-blanca-nube.svg",
    tag: "Minimal",
    medida: "Medida por confirmar",
    stock: "Disponible",
    featured: false
  }
];

let cart = loadCart();
let productQuantities = {};
let toastTimeout;

const elements = {
  year: document.getElementById("year"),
  menuToggle: document.getElementById("menuToggle"),
  navLinks: document.getElementById("navLinks"),
  productGrid: document.getElementById("productGrid"),
  featuredProducts: document.getElementById("featuredProducts"),
  categoryFilter: document.getElementById("categoryFilter"),
  sortFilter: document.getElementById("sortFilter"),
  searchInput: document.getElementById("searchInput"),
  emptyState: document.getElementById("emptyState"),
  cartDrawer: document.getElementById("cartDrawer"),
  cartItems: document.getElementById("cartItems"),
  cartSubtotal: document.getElementById("cartSubtotal"),
  cartCountTop: document.getElementById("cartCountTop"),
  cartCountFloating: document.getElementById("cartCountFloating"),
  openCartTop: document.getElementById("openCartTop"),
  openCartFloating: document.getElementById("openCartFloating"),
  openCartFooter: document.getElementById("openCartFooter"),
  closeCart: document.getElementById("closeCart"),
  cartBackdrop: document.getElementById("cartBackdrop"),
  clearCart: document.getElementById("clearCart"),
  checkoutWhatsapp: document.getElementById("checkoutWhatsapp"),
  buyerName: document.getElementById("buyerName"),
  deliveryZone: document.getElementById("deliveryZone"),
  giftCheck: document.getElementById("giftCheck"),
  giftNote: document.getElementById("giftNote"),
  toast: document.getElementById("toast"),
  quickContactForm: document.getElementById("quickContactForm"),
  quickName: document.getElementById("quickName"),
  quickMessage: document.getElementById("quickMessage")
};

init();

function init() {
  elements.year.textContent = new Date().getFullYear();

  setupMenu();
  setupFilters();
  setupCartButtons();
  setupWhatsappLinks();
  setupQuickForm();
  restoreCartExtra();
  setupCartExtraPersistence();
  renderFeaturedProducts();
  renderProducts();
  renderCart();
  setupRevealAnimations();
}

function setupMenu() {
  elements.menuToggle.addEventListener("click", () => {
    const isOpen = elements.navLinks.classList.toggle("open");
    elements.menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  elements.navLinks.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      elements.navLinks.classList.remove("open");
      elements.menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

function setupFilters() {
  const categories = ["todos", ...new Set(products.map(product => product.category))];

  elements.categoryFilter.innerHTML = categories.map(category => {
    const label = category === "todos" ? "Todas" : category;
    return `<option value="${escapeAttribute(category)}">${escapeHTML(label)}</option>`;
  }).join("");

  elements.categoryFilter.addEventListener("change", renderProducts);
  elements.sortFilter.addEventListener("change", renderProducts);
  elements.searchInput.addEventListener("input", renderProducts);
}

function setupCartButtons() {
  elements.openCartTop.addEventListener("click", openCart);
  elements.openCartFloating.addEventListener("click", openCart);
  elements.openCartFooter.addEventListener("click", openCart);
  elements.closeCart.addEventListener("click", closeCart);
  elements.cartBackdrop.addEventListener("click", closeCart);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCart();
  });

  elements.clearCart.addEventListener("click", () => {
    if (cart.length === 0) {
      showToast("El carrito ya está vacío. Qué eficiencia tan dramática.");
      return;
    }

    cart = [];
    saveCart();
    renderCart();
    showToast("Carrito vacío.");
  });

  elements.checkoutWhatsapp.addEventListener("click", checkoutToWhatsapp);
}

function setupWhatsappLinks() {
  document.querySelectorAll(".js-whatsapp-general").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      openWhatsapp(`Hola, quiero más información sobre las materas y suculentas de ${BUSINESS_NAME}. ¿Me ayudas con disponibilidad, precios y domicilio?`);
    });
  });

  document.querySelectorAll(".js-whatsapp-gift").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      openWhatsapp(`Hola, quiero armar un regalo con materas o suculentas de ${BUSINESS_NAME}. ¿Me ayudas a elegir según ocasión y presupuesto?`);
    });
  });

  // Chips de ocasiones de regalo: cada uno abre WhatsApp con el contexto.
  document.querySelectorAll(".js-whatsapp-occasion").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      const occasion = button.dataset.occasion || "un detalle especial";
      openWhatsapp(`Hola, quiero un regalo de ${BUSINESS_NAME} para ${occasion}. ¿Me ayudas a elegir según presupuesto y disponibilidad?`);
    });
  });

  // Botón de pedidos corporativos / por cantidad.
  document.querySelectorAll(".js-whatsapp-corporate").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      openWhatsapp(`Hola, quiero cotizar un pedido especial por cantidad con ${BUSINESS_NAME} (empresa, colegio, evento o celebración). ¿Me ayudas con opciones y precios?`);
    });
  });
}

function setupQuickForm() {
  elements.quickContactForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = elements.quickName.value.trim();
    const message = elements.quickMessage.value.trim();

    if (!message) {
      showToast("Cuéntanos qué estás buscando antes de enviar.");
      return;
    }

    const text = [
      "Hola, quiero hacer una consulta en Espíritu Floral.",
      "",
      name ? `Nombre: ${name}` : null,
      `Mensaje: ${message}`
    ].filter(Boolean).join("\n");

    openWhatsapp(text);
  });
}

function setupCartExtraPersistence() {
  [elements.buyerName, elements.deliveryZone, elements.giftCheck, elements.giftNote].forEach(input => {
    input.addEventListener("input", saveCartExtra);
    input.addEventListener("change", saveCartExtra);
  });
}

function restoreCartExtra() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_EXTRA_STORAGE_KEY)) || {};
    elements.buyerName.value = saved.buyerName || "";
    elements.deliveryZone.value = saved.deliveryZone || "";
    elements.giftCheck.checked = Boolean(saved.giftCheck);
    elements.giftNote.value = saved.giftNote || "";
  } catch (error) {
    console.warn("No se pudo restaurar la información extra del carrito.", error);
  }
}

function saveCartExtra() {
  const data = {
    buyerName: elements.buyerName.value.trim(),
    deliveryZone: elements.deliveryZone.value.trim(),
    giftCheck: elements.giftCheck.checked,
    giftNote: elements.giftNote.value.trim()
  };

  localStorage.setItem(CART_EXTRA_STORAGE_KEY, JSON.stringify(data));
}

function renderFeaturedProducts() {
  const featured = products.filter(product => product.featured).slice(0, 3);

  elements.featuredProducts.innerHTML = featured.map(product => `
    <article class="featured-card">
      <img src="${escapeAttribute(product.image)}" alt="${escapeAttribute(product.name)}" loading="lazy">
      <div class="featured-content">
        <p class="product-meta">${escapeHTML(product.category)}</p>
        <h3>${escapeHTML(product.name)}</h3>
        <p>${escapeHTML(product.description)}</p>
        <strong class="price">${formatPrice(product.price)}</strong>
      </div>
    </article>
  `).join("");
}

function renderProducts() {
  const search = normalize(elements.searchInput.value);
  const category = elements.categoryFilter.value;
  const sort = elements.sortFilter.value;

  let filtered = products.filter(product => {
    const matchesCategory = category === "todos" || product.category === category;
    const matchesSearch = !search || [
      product.name,
      product.category,
      product.description,
      product.tag,
      product.stock
    ].some(value => normalize(value).includes(search));

    return matchesCategory && matchesSearch;
  });

  filtered = sortProducts(filtered, sort);

  elements.emptyState.classList.toggle("hidden", filtered.length > 0);

  elements.productGrid.innerHTML = filtered.map(product => {
    const qty = productQuantities[product.id] || 1;
    const stockClass = getStockClass(product.stock);

    return `
      <article class="product-card">
        <div class="product-image-wrap">
          <img src="${escapeAttribute(product.image)}" alt="${escapeAttribute(product.name)}" loading="lazy">
          <span class="product-badge">${escapeHTML(product.tag)}</span>
          <span class="stock-badge ${stockClass}">${escapeHTML(product.stock)}</span>
        </div>

        <div class="product-content">
          <p class="product-meta">${escapeHTML(product.category)}</p>
          <h3>${escapeHTML(product.name)}</h3>
          <p class="product-description">${escapeHTML(product.description)}</p>

          <ul class="product-specs">
            <li><span>Medida</span> ${escapeHTML(product.medida || "Medida por confirmar")}</li>
            <li><span>Disponibilidad</span> ${escapeHTML(product.stock || "Consultar disponibilidad")}</li>
          </ul>

          <div class="product-footer">
            <strong class="price">${formatPrice(product.price)}</strong>

            <div class="product-actions">
              <div class="qty-control" aria-label="Cantidad para ${escapeAttribute(product.name)}">
                <button type="button" data-qty-minus="${product.id}" aria-label="Disminuir cantidad">−</button>
                <span id="qty-${product.id}">${qty}</span>
                <button type="button" data-qty-plus="${product.id}" aria-label="Aumentar cantidad">+</button>
              </div>

              <button class="add-button" type="button" data-add-cart="${product.id}">
                Agregar
              </button>
            </div>

            <button class="product-whatsapp" type="button" data-whatsapp-product="${product.id}">
              Consultar por WhatsApp
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  bindProductActions();
}

function bindProductActions() {
  document.querySelectorAll("[data-qty-minus]").forEach(button => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.qtyMinus);
      productQuantities[productId] = Math.max(1, (productQuantities[productId] || 1) - 1);
      updateQuantityLabel(productId);
    });
  });

  document.querySelectorAll("[data-qty-plus]").forEach(button => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.qtyPlus);
      productQuantities[productId] = Math.min(99, (productQuantities[productId] || 1) + 1);
      updateQuantityLabel(productId);
    });
  });

  document.querySelectorAll("[data-add-cart]").forEach(button => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.addCart);
      const qty = productQuantities[productId] || 1;
      addToCart(productId, qty);
    });
  });

  document.querySelectorAll("[data-whatsapp-product]").forEach(button => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.whatsappProduct);
      const product = products.find(item => item.id === productId);
      if (!product) return;

      // Mensaje comercial enfocado en un producto puntual.
      openWhatsapp(
        `Hola, quiero más información sobre este producto de ${BUSINESS_NAME}: ${product.name}. ` +
        `¿Me ayudas con disponibilidad, precio final y domicilio?`
      );
    });
  });
}

function updateQuantityLabel(productId) {
  const label = document.getElementById(`qty-${productId}`);
  if (label) label.textContent = productQuantities[productId] || 1;
}

function sortProducts(items, sort) {
  const sorted = [...items];

  if (sort === "precio-asc") return sorted.sort((a, b) => a.price - b.price);
  if (sort === "precio-desc") return sorted.sort((a, b) => b.price - a.price);
  if (sort === "nombre") return sorted.sort((a, b) => a.name.localeCompare(b.name, "es"));

  return sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
}

function addToCart(productId, quantity = 1) {
  const product = products.find(item => item.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity });
  }

  saveCart();
  renderCart();
  showToast(`${product.name} agregado al carrito.`);
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = getCartSubtotal();

  elements.cartCountTop.textContent = count;
  elements.cartCountFloating.textContent = count;
  elements.cartSubtotal.textContent = formatPrice(subtotal);

  if (cart.length === 0) {
    elements.cartItems.innerHTML = `
      <div class="empty-state">
        <h3>Tu carrito está vacío</h3>
        <p>Agrega una matera, una suculenta o algo verde antes de pedirle milagros al WhatsApp.</p>
      </div>
    `;
    return;
  }

  elements.cartItems.innerHTML = cart.map(item => {
    const product = products.find(productItem => productItem.id === item.id);
    if (!product) return "";

    return `
      <article class="cart-item">
        <img src="${escapeAttribute(product.image)}" alt="${escapeAttribute(product.name)}">
        <div class="cart-item-info">
          <h3>${escapeHTML(product.name)}</h3>
          <p>${formatPrice(product.price)} c/u</p>
          <div class="cart-item-actions">
            <button class="small-button" data-cart-minus="${product.id}" aria-label="Disminuir">−</button>
            <strong>${item.quantity}</strong>
            <button class="small-button" data-cart-plus="${product.id}" aria-label="Aumentar">+</button>
            <button class="remove-button" data-remove="${product.id}">Eliminar</button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  bindCartActions();
}

function bindCartActions() {
  document.querySelectorAll("[data-cart-minus]").forEach(button => {
    button.addEventListener("click", () => changeCartQuantity(Number(button.dataset.cartMinus), -1));
  });

  document.querySelectorAll("[data-cart-plus]").forEach(button => {
    button.addEventListener("click", () => changeCartQuantity(Number(button.dataset.cartPlus), 1));
  });

  document.querySelectorAll("[data-remove]").forEach(button => {
    button.addEventListener("click", () => removeFromCart(Number(button.dataset.remove)));
  });
}

function changeCartQuantity(productId, delta) {
  const item = cart.find(cartItem => cartItem.id === productId);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  renderCart();
}

function checkoutToWhatsapp() {
  if (cart.length === 0) {
    showToast("Agrega productos antes de finalizar el pedido.");
    return;
  }

  saveCartExtra();

  const buyerName = elements.buyerName.value.trim();
  const deliveryZone = elements.deliveryZone.value.trim();
  const giftCheck = elements.giftCheck.checked;
  const giftNote = elements.giftNote.value.trim();

  const lines = cart.map((item, index) => {
    const product = products.find(productItem => productItem.id === item.id);
    if (!product) return null;

    const lineTotal = product.price * item.quantity;
    return `${index + 1}. ${product.name} x${item.quantity} - ${formatPrice(lineTotal)} (${formatPrice(product.price)} c/u)`;
  }).filter(Boolean);

  const subtotal = getCartSubtotal();

  const message = [
    `Hola, quiero hacer este pedido de ${BUSINESS_NAME}:`,
    "",
    "Productos:",
    ...lines,
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    "",
    buyerName ? `Nombre: ${buyerName}` : null,
    deliveryZone ? `Zona/barrio de entrega: ${deliveryZone}` : null,
    giftCheck ? "Es para regalo: Sí" : "Es para regalo: No",
    giftNote ? `Nota/mensaje: ${giftNote}` : null,
    "",
    "¿Me confirmas disponibilidad, valor total y domicilio?"
  ].filter(line => line !== null).join("\n");

  openWhatsapp(message);
}

function getCartSubtotal() {
  return cart.reduce((sum, item) => {
    const product = products.find(productItem => productItem.id === item.id);
    if (!product) return sum;
    return sum + product.price * item.quantity;
  }, 0);
}

function openCart() {
  elements.cartDrawer.classList.add("open");
  elements.cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("cart-open");
}

function closeCart() {
  elements.cartDrawer.classList.remove("open");
  elements.cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("cart-open");
}

function openWhatsapp(message) {
  // El placeholder "57XXXXXXXXXX" queda como "57" tras quitar las X (no son dígitos),
  // por eso validamos que el número tenga una longitud real (mínimo 10 dígitos).
  const cleanNumber = WHATSAPP_NUMBER.replace(/\D/g, "");
  if (!cleanNumber || cleanNumber.length < 10) {
    showToast("Cambia el número de WhatsApp en app.js (constante WHATSAPP_NUMBER) antes de publicar.");
    return;
  }

  const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function loadCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
    if (!Array.isArray(savedCart)) return [];
    return savedCart.filter(item => products.some(product => product.id === item.id));
  } catch (error) {
    console.warn("No se pudo cargar el carrito.", error);
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function formatPrice(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(value);
}

function normalize(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function getStockClass(stock) {
  const normalized = normalize(stock);
  if (normalized.includes("pocas")) return "low";
  if (normalized.includes("encargo")) return "order";
  return "";
}

function showToast(message) {
  clearTimeout(toastTimeout);
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");

  toastTimeout = setTimeout(() => {
    elements.toast.classList.remove("visible");
  }, 2800);
}

function setupRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach(element => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(element => observer.observe(element));
}

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value = "") {
  return escapeHTML(value);
}

// Funciones preparadas para conectar luego con Google Analytics / Meta Pixel.
// Por ahora solo dejan trazabilidad en consola para no meter dependencias innecesarias.
function trackEvent(eventName, payload = {}) {
  console.info(`[tracking] ${eventName}`, payload);

  if (window.gtag) {
    window.gtag("event", eventName, payload);
  }
}
