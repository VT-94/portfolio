// Diaporama
// Optimisation : utiliser const pour les tableaux constants (meilleure performance)
const images = [
  "images/jpg/diapo1.jpg",
  "images/jpg/diapo2.jpg",
  "images/jpg/diapo3.jpg",
  "images/jpg/diapo4.jpg",
];
const texts = [
  "Cartographie",
  "Modélisation 3D",
  "Gestion de bases de données",
  "Programmation",
];

let index = 0;
let imgElement;
let textElement;

// Optimisation : utiliser une fonction flèche pour nextSlide
const nextSlide = () => {
  index = (index + 1) % images.length;
  if (!imgElement || !textElement) return;
  imgElement.style.opacity = "0";

  // Utiliser une constante pour le timeout (30ms pour la transition)
  const transitionDuration = 500;
  setTimeout(() => {
    imgElement.src = images[index];
    textElement.textContent = texts[index];
    imgElement.style.opacity = "1";
  }, transitionDuration);
};

// Onglets Parcours (Toggle Sections)
// Optimisation : utiliser forEach avec une fonction flèche et éviter les répétitions
document.querySelectorAll(".section-toggle").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    // Récupérer l'élément de contenu associé
    const content = toggle.nextElementSibling;

    // Vérifier si la section est déjà ouverte
    if (content.classList.contains("open")) {
      content.style.maxHeight = "0";
      content.classList.remove("open");
    } else {
      // Fermer toutes les autres sections avant d'ouvrir celle-ci
      document.querySelectorAll(".section-content").forEach((section) => {
        section.style.maxHeight = "0";
        section.classList.remove("open");
      });

      // Ouvrir la section sélectionnée
      content.style.maxHeight = content.scrollHeight + "px";
      content.classList.add("open");
    }
  });
});

// Formulaire de contact
// Optimisation : récupérer les éléments une seule fois
const contactForm = document.getElementById("contactForm");
const confirmationMessage = document.getElementById("confirmationMessage");

// Ajouter un listener au formulaire avec validation améliorée
contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Optimisation : vérifier que tous les champs sont remplis
  if (
    contactForm.name.value.trim() &&
    contactForm.email.value.trim() &&
    contactForm.message.value.trim()
  ) {
    // Afficher le message de confirmation (style défini en CSS)
    confirmationMessage.style.display = "block";
    // Réinitialiser le formulaire
    contactForm.reset();
  }
});

// Animation des sections au défilement
// Optimisation : utiliser DOMContentLoaded pour attendre que le DOM soit prêt
document.addEventListener("DOMContentLoaded", function () {
  // Récupérer toutes les sections
  const sections = document.querySelectorAll("section");

  // Utiliser IntersectionObserver pour une animation au défilement performante
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Ajouter la classe "visible" quand la section est visible
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    { threshold: 0.2 }, // Déclencher quand 20% de la section est visible
  );

  // Observer chaque section
  sections.forEach((section) => observer.observe(section));

  // Initialisation du diaporama
  // Optimisation : initialiser après que le DOM soit complètement prêt
  imgElement = document.getElementById("slide-image");
  textElement = document.getElementById("slide-text");
  if (imgElement && textElement) {
    textElement.textContent = texts[index];
    // Démarrer le diaporama automatique (changement toutes les 4 secondes)
    const slideInterval = 4000;
    setInterval(nextSlide, slideInterval);
  }

  //  Récupération de la version depuis GitHub
  // Fetch la dernière release du dépôt portfolio
  fetch("https://api.github.com/repos/VT-94/portfolio/releases/latest")
    .then((response) => {
      if (!response.ok) throw new Error("Impossible de récupérer la version");
      return response.json();
    })
    .then((data) => {
      const version = data.name || data.name || "inconnue";
      const publishedAt = data.published_at 
        ? new Date(data.published_at).toLocaleDateString("fr-FR")
        : "inconnue";
      document.getElementById("version").textContent = 
        `${version} – Dernière mise à jour : ${publishedAt}`;
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération de la version :", error);
      document.getElementById("version").textContent = "N/A";
    });
});
