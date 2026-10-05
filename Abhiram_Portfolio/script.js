// Set your email here to make the contact form open your mail app.
// Leave it empty until you have decided which address to publish.
const CONTACT_EMAIL = "";

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

function setMenu(open) {
  navLinks.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.firstElementChild.className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
}
menuBtn.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

// Scroll reveal
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

// Highlight the current section in the nav
const navAnchors = navLinks.querySelectorAll("a");
const sections = document.querySelectorAll("main section[id]");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 120) current = section.id;
  });
  navAnchors.forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === "#" + current);
  });
});

// Contact form validation
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

function showError(id, message) {
  const field = document.getElementById(id);
  form.querySelector('.err[data-for="' + id + '"]').textContent = message;
  field.classList.toggle("invalid", Boolean(message));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  statusEl.textContent = "";
  statusEl.className = "";

  const values = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    subject: form.subject.value.trim(),
    message: form.message.value.trim(),
  };

  let valid = true;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  showError("name", values.name ? "" : "Enter your name.");
  showError("email", emailPattern.test(values.email) ? "" : "Enter a valid email address.");
  showError("subject", values.subject ? "" : "Enter a subject.");
  showError("message", values.message.length >= 10 ? "" : "Write a message of at least 10 characters.");

  Object.keys(values).forEach((key) => {
    if (form.querySelector('.err[data-for="' + key + '"]').textContent) valid = false;
  });
  if (!valid) return;

  if (!CONTACT_EMAIL) {
    statusEl.textContent = "Sending isn't set up yet. Please use the GitHub or LinkedIn links below.";
    statusEl.className = "bad";
    return;
  }

  const body = values.message + "\n\nFrom: " + values.name + " (" + values.email + ")";
  window.location.href =
    "mailto:" + CONTACT_EMAIL +
    "?subject=" + encodeURIComponent(values.subject) +
    "&body=" + encodeURIComponent(body);
  statusEl.textContent = "Opening your email app...";
  statusEl.className = "ok";
  form.reset();
});
