document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#mainNav");

  if (menuButton) {
    menuButton.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", open);
      menuButton.textContent = open ? "×" : "☰";
    });
  }

  document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "☰";
    });
  });

  const dropBtn = document.querySelector(".nav-drop-btn");
  const drop = document.querySelector(".nav-dropdown");
  if (dropBtn) {
    dropBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      const open = drop.classList.toggle("open");
      dropBtn.setAttribute("aria-expanded", open);
    });
  }

  document.addEventListener("click", (event) => {
    if (drop && !drop.contains(event.target)) {
      drop.classList.remove("open");
      if (dropBtn) dropBtn.setAttribute("aria-expanded", "false");
    }
  });

  const loginModal = document.querySelector("#loginModal");
  const validateModal = document.querySelector("#validateModal");

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    if (![loginModal, validateModal].some(m => m && m.classList.contains("open"))) {
      document.body.style.overflow = "";
    }
  }

  document.querySelector(".login-trigger")?.addEventListener("click", (e) => {
    e.preventDefault();
    openModal(loginModal);
  });

  document.querySelector(".validate-trigger")?.addEventListener("click", () => openModal(validateModal));

  document.querySelectorAll("[data-close-modal]").forEach(btn => {
    btn.addEventListener("click", () => closeModal(btn.closest(".modal-backdrop")));
  });

  [loginModal, validateModal].forEach(modal => {
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal(loginModal);
      closeModal(validateModal);
    }
  });

  document.querySelector(".password-toggle")?.addEventListener("click", () => {
    const field = document.querySelector("#password");
    if (!field) return;
    field.type = field.type === "password" ? "text" : "password";
  });

  document.querySelector("#loginForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Member login placeholder: database authentication will be connected here.");
  });

  document.querySelector("#validateForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const result = document.querySelector("#validationResult");
    result.textContent = "Validation placeholder: once connected to the member database, the linked Carelink username will appear here.";
    result.classList.add("show");
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
});
