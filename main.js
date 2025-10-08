

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Example: Mobile nav toggle (if you add a burger menu later)
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('hidden');
  });
}

// Example Snipcart event hook (logs when cart is confirmed)
document.addEventListener('snipcart.ready', () => {
  Snipcart.events.on('cart.confirm', (cart) => {
    console.log('Order confirmed:', cart);
  });
});

// --- Cart open control: toggle cart only after Snipcart is ready ---
(function () {
  const cartBtn = document.getElementById('cart-btn');
  if (!cartBtn) return;

  // Remove any forced cart hash that can auto-open the modal
  if (location.hash && location.hash.toLowerCase().includes('cart')) {
    try {
      history.replaceState(null, '', location.pathname + location.search);
    } catch (_) {
      location.hash = '';
    }
  }

  // Track open/close state
  let cartOpen = false;

  // Prevent clicks before Snipcart is ready
  cartBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const ready = !!(window.Snipcart && window.Snipcart.api && window.Snipcart.store);
    if (!ready) {
      console.warn('Cart not ready yet.');
      return;
    }

    // Toggle using Snipcart API; fallback to DOM class check
    try {
      if (cartOpen) {
        window.Snipcart.api.theme.cart.close();
      } else {
        window.Snipcart.api.theme.cart.open();
      }
    } catch (err) {
      const cartRoot = document.querySelector('#snipcart');
      const opened = cartRoot && cartRoot.classList && cartRoot.classList.contains('snipcart-cart--opened');
      if (opened) {
        const closeBtn = document.querySelector('[data-action="close-cart"], .snipcart-cart__close');
        if (closeBtn) closeBtn.click();
      } else {
        cartBtn.classList.add('snipcart-checkout');
        cartBtn.click();
        cartBtn.classList.remove('snipcart-checkout');
      }
    }
  });

  // Hook Snipcart lifecycle when ready
  document.addEventListener('snipcart.ready', () => {
    try {
      window.Snipcart.events.on('cart.opened', () => { cartOpen = true; });
      window.Snipcart.events.on('cart.closed', () => { cartOpen = false; });
    } catch (_) {}
  });
})();

// --- Ensure cart toggle works consistently across all screen sizes ---
(function () {
  const cartBtn = document.getElementById('cart-btn');
  if (!cartBtn) return;

  // Track open/close state
  let cartOpen = false;

  // Helper to close cart
  function closeCart() {
    try {
      window.Snipcart.api.theme.cart.close();
    } catch (_) {
      const closeBtn = document.querySelector('[data-action="close-cart"], .snipcart-cart__close');
      if (closeBtn) closeBtn.click();
    }
  }

  // Helper to open cart
  function openCart() {
    try {
      window.Snipcart.api.theme.cart.open();
    } catch (_) {
      cartBtn.classList.add('snipcart-checkout');
      cartBtn.click();
      cartBtn.classList.remove('snipcart-checkout');
    }
  }

  cartBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const ready = !!(window.Snipcart && window.Snipcart.api && window.Snipcart.store);
    if (!ready) {
      console.warn('Cart not ready yet.');
      return;
    }

    if (cartOpen) {
      closeCart();
    } else {
      openCart();
    }
  });

  // Keep state in sync with Snipcart events
  document.addEventListener('snipcart.ready', () => {
    try {
      window.Snipcart.events.on('cart.opened', () => { cartOpen = true; });
      window.Snipcart.events.on('cart.closed', () => { cartOpen = false; });
    } catch (_) {}
  });
})();