const aujourdHui = new Date();
document.getElementById("date").textContent =
  aujourdHui.toLocaleDateString("fr-FR");

// Mémorisation de la position de scroll pour le retour arrière
window.addEventListener("pagehide", () => {
  sessionStorage.setItem("scroll-index", window.scrollY);
});
window.addEventListener("pageshow", (e) => {
  if (e.persisted) return;
  const y = sessionStorage.getItem("scroll-index");
  if (y !== null) {
    window.scrollTo(0, parseInt(y));
    sessionStorage.removeItem("scroll-index");
  }
});

// Diaporama
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

const nextSlide = () => {
  index = (index + 1) % images.length;
  if (!imgElement || !textElement) return;
  imgElement.style.opacity = "0";

  // Laisser le fondu se terminer avant de changer d'image
  const transitionDuration = 500;
  setTimeout(() => {
    imgElement.src = images[index];
    textElement.textContent = texts[index];
    imgElement.style.opacity = "1";
  }, transitionDuration);
};

// Onglets Parcours (accordéons)
document.querySelectorAll(".section-toggle").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const content = toggle.nextElementSibling;

    if (content.classList.contains("open")) {
      content.style.maxHeight = "0";
      content.classList.remove("open");
    } else {
      // Fermer toutes les autres sections avant d'ouvrir celle-ci
      document.querySelectorAll(".section-content").forEach((section) => {
        section.style.maxHeight = "0";
        section.classList.remove("open");
      });

      content.style.maxHeight = content.scrollHeight + "px";
      content.classList.add("open");
    }
  });
});

// Menu burger (mobile)
const bandeau = document.querySelector(".bandeau");
const burger = document.querySelector(".burger");
if (burger && bandeau) {
  burger.addEventListener("click", () => {
    bandeau.classList.toggle("open");
  });
  // Refermer le menu après le choix d'une section
  bandeau.querySelectorAll("ul li a").forEach((link) => {
    link.addEventListener("click", () => bandeau.classList.remove("open"));
  });
}

// Formulaire de contact
const TEST_MODE = false; // true pour tester le formulaire directement, repasser à false avant mise en ligne
const TEST_ERROR = false; // true pour tester la popup d'erreur, false pour tester la popup de succès
const SUCCESS_MESSAGE = "Votre message a bien été transmis. Je reviendrai prochainement vers vous par e-mail.\nMerci !";
const ERROR_MESSAGE =
  "Une erreur est survenue et votre message n'a pas pu être envoyé.\nSi le problème persiste, vous pouvez me contacter sur LinkedIn :";
const contactForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const formModal = document.getElementById("formModal");
const formModalMessage = document.getElementById("formModalMessage");
const formModalLinkedin = document.getElementById("formModalLinkedin");
const formModalClose = document.getElementById("formModalClose");

function showFormModal(message, { showLinkedin = false } = {}) {
  formModalMessage.textContent = message;
  formModalLinkedin.style.display = showLinkedin ? "block" : "none";
  formModal.showModal();
}

formModalClose.addEventListener("click", () => formModal.close());

// Fermer la popup en cliquant en dehors
formModal.addEventListener("click", (event) => {
  const rect = formModal.getBoundingClientRect();
  const isInDialog =
    rect.top <= event.clientY &&
    event.clientY <= rect.bottom &&
    rect.left <= event.clientX &&
    event.clientX <= rect.right;
  if (!isInDialog) formModal.close();
});

contactForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  submitBtn.disabled = true;
  submitBtn.textContent = "Envoi en cours…";

  if (TEST_MODE) {
    setTimeout(() => {
      showFormModal(TEST_ERROR ? ERROR_MESSAGE : SUCCESS_MESSAGE, {
        showLinkedin: TEST_ERROR,
      });
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = "Envoyer";
    }, 500);
    return;
  }

  const data = Object.fromEntries(new FormData(contactForm).entries());

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (result.success) {
      showFormModal(SUCCESS_MESSAGE);
      contactForm.reset();
    } else {
      showFormModal(ERROR_MESSAGE, { showLinkedin: true });
    }
  } catch {
    showFormModal(ERROR_MESSAGE, { showLinkedin: true });
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Envoyer";
  }
});

// Animation des sections au défilement
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
    { threshold: 0.2 }, // Déclencher quand 20% de la section est visible
  );

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

  window.addEventListener("resize", updateActiveLinkByScroll);
  updateActiveLinkByScroll();

  // Initialisation du diaporama
  imgElement = document.getElementById("slide-image");
  textElement = document.getElementById("slide-text");
  if (imgElement && textElement) {
    textElement.textContent = texts[index];
    // Démarrer le diaporama automatique (changement toutes les 4 secondes)
    const slideInterval = 4000;
    setInterval(nextSlide, slideInterval);
  }
});
