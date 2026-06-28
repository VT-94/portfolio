const aujourdHui = new Date();
document.getElementById("date").textContent =
  aujourdHui.toLocaleDateString("fr-FR");

// Empêcher le navigateur de restaurer automatiquement la position du scroll
window.history.scrollRestoration = 'manual';

// Forcer le scroll en haut de la page au chargement
window.scrollTo(0, 0);

// Diaporama
// Optimisation : utiliser const pour les tableaux constants (meilleure performance)
const images = [
  "media/diaporama/diapo1.jpg",
  "media/diaporama/diapo2.jpg",
  "media/diaporama/diapo3.jpg",
  "media/diaporama/diapo4.jpg",
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

  // Mettre en surbrillance le lien de navigation de la section active
  const navLinks = document.querySelectorAll(".bandeau ul li a");
  const idToLink = {};
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    const id = href.slice(1);
    const section = document.getElementById(id);
    if (section) idToLink[id] = link;
  });

  const navObserver = new IntersectionObserver(
    (entries) => {
      // Choisir la section intersectée avec le plus grand ratio
      let maxEntry = null;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (
            !maxEntry ||
            entry.intersectionRatio > maxEntry.intersectionRatio
          ) {
            maxEntry = entry;
          }
        }
      });

      // Retirer actif de tous les liens
      navLinks.forEach((l) => l.classList.remove("active"));

      if (maxEntry) {
        const id = maxEntry.target.id;
        const link = idToLink[id];
        if (link) link.classList.add("active");
      }
    },
    { threshold: [0.25, 0.5, 0.75] },
  );

  // Observer uniquement les sections présentes dans la nav
  Object.keys(idToLink).forEach((id) => {
    const s = document.getElementById(id);
    if (s) navObserver.observe(s);
  });

  // Fallback robuste: déterminer la section active au scroll (pour sections petites)
  const sectionIds = Object.keys(idToLink);
  let ticking = false;

  function updateActiveLinkByScroll() {
    let closestId = null;
    let closestDistance = Infinity;
    const offset = 120; // tenir compte de scroll-padding-top

    sectionIds.forEach((id) => {
      const s = document.getElementById(id);
      if (!s) return;
      const rect = s.getBoundingClientRect();
      const distance = Math.abs(rect.top - offset);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestId = id;
      }
    });

    // Appliquer la classe active
    navLinks.forEach((l) => l.classList.remove("active"));
    if (closestId) {
      const link = idToLink[closestId];
      if (link) link.classList.add("active");
    }
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveLinkByScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );

  // Mettre à jour aussi au chargement et au redimensionnement
  window.addEventListener("resize", updateActiveLinkByScroll);
  // Exécuter une fois pour initialiser
  updateActiveLinkByScroll();

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

  // Afficher uniquement le numéro de release (sans date)
  fetch("https://api.github.com/repos/VT-94/portfolio/releases/latest")
    .then((response) => {
      if (!response.ok) throw new Error("Impossible de récupérer la version");
      return response.json();
    })
    .then((data) => {
      const version = data.name || data.tag_name || "inconnue";
      document.getElementById("version").textContent = version;
    })
    .catch(() => {
      document.getElementById("version").textContent = "version inconnue";
    });
});
