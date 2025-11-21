// === Diaporama ===
const images = [
  "images/diapo1.jpg",
  "images/diapo2.jpg",
  "images/diapo3.jpg",
  "images/diapo4.jpg",
];
const texts = [
  "Cartographie",
  "Modélisation 3D",
  "Gestion de bases de données",
  "Programmation",
];

let index = 0;
const imgElement = document.getElementById("slide-image");
const textElement = document.getElementById("slide-text");

function nextSlide() {
  index = (index + 1) % images.length;
  imgElement.style.opacity = "0";

  setTimeout(() => {
    imgElement.src = images[index];
    textElement.textContent = texts[index];
    imgElement.style.opacity = "1";
  }, 500);
}

setInterval(nextSlide, 4000);

// === Onglets Parcours (Toggle Sections) ===
document.querySelectorAll(".section-toggle").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const content = toggle.nextElementSibling;

    // Vérifie si la section est déjà ouverte
    if (content.classList.contains("open")) {
      content.style.maxHeight = "0";
      content.classList.remove("open");
    } else {
      // Ferme toutes les autres sections avant d'ouvrir
      document.querySelectorAll(".section-content").forEach((section) => {
        section.style.maxHeight = "0";
        section.classList.remove("open");
      });

      content.style.maxHeight = content.scrollHeight + "px";
      content.classList.add("open");
    }
  });
});

// === Formulaire de contact ===
const contactForm = document.getElementById("contactForm");
const confirmationMessage = document.getElementById("confirmationMessage");

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (
    contactForm.name.value.trim() &&
    contactForm.email.value.trim() &&
    contactForm.message.value.trim()
  ) {
    confirmationMessage.style.display = "block";
    contactForm.reset();
  }
});

// === Animation des sections au défilement ===
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  sections.forEach((section) => observer.observe(section));
});
