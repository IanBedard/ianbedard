// Ian Bédard — small progressive enhancements. The site works without JS.
(function () {
  var fr = document.documentElement.lang === "fr";

  // Mobile navigation toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && window.matchMedia("(max-width: 860px)").matches) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        toggle.focus();
      }
    });
  }

  // Pre-select the package in the contact form when a pricing card button is clicked
  document.querySelectorAll("[data-package]").forEach(function (link) {
    link.addEventListener("click", function () {
      var select = document.getElementById("package");
      if (select) select.value = link.getAttribute("data-package");
    });
  });

  // Contact form: submit to Formspree without leaving the page
  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.action.indexOf("YOUR_FORM_ID") !== -1) {
        status.className = "form-status err";
        status.textContent = fr
          ? "Le formulaire n’est pas encore configuré. Écrivez-moi directement par courriel."
          : "The form isn’t set up yet. Please email me directly.";
        return;
      }
      var button = form.querySelector("button[type=submit]");
      button.disabled = true;
      status.className = "form-status";
      status.textContent = fr ? "Envoi en cours…" : "Sending…";
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (!res.ok) throw new Error(res.status);
          form.reset();
          status.className = "form-status ok";
          status.textContent = fr
            ? "Merci! Je vous réponds d’ici un jour ouvrable."
            : "Thanks! I’ll reply within 1 business day.";
        })
        .catch(function () {
          status.className = "form-status err";
          status.textContent = fr
            ? "Oups, l’envoi a échoué. Réessayez ou écrivez-moi par courriel."
            : "Sorry, something went wrong. Try again or email me directly.";
        })
        .finally(function () { button.disabled = false; });
    });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
