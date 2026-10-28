// Web Component pour le pied de page commun à toutes les pages

// Racine du site, déduite de l'emplacement de ce script (js/site-footer.js)
const SITE_ROOT = new URL("../", document.currentScript.src);

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
        <div class="footer-content">
          <div class="footer-col">
            <p class="footer-name">Vincent Thorin</p>
            <p class="footer-job">Géomaticien</p>
            <p class="footer-keywords">SIG · Cartographie · Analyse spatiale</p>
          </div>

          <nav class="footer-col" aria-label="Navigation du pied de page">
            <p class="footer-title">Navigation</p>
            <ul class="footer-nav">
              <li><a data-section="realisations">Réalisations</a></li>
              <li><a data-section="parcours">Parcours</a></li>
              <li><a data-section="contact">Contact</a></li>
            </ul>
          </nav>

          <div class="footer-col footer-col-links">
            <div class="footer-links">
              <a
                href="https://www.linkedin.com/in/vincent-thorin/"
                target="_blank"
                rel="noopener noreferrer"
                title="Mon profil LinkedIn"
              >
                <img data-src="media/logos/linkedin.svg" alt="LinkedIn" class="footer-icon" loading="lazy" />
              </a>
              <a
                href="https://github.com/VT-94"
                target="_blank"
                rel="noopener noreferrer"
                title="Mon profil GitHub"
              >
                <img data-src="media/logos/github.svg" alt="GitHub" class="footer-icon" loading="lazy" />
              </a>
              <a
                data-href="media/cv/CV_Thorin_Vincent.pdf"
                target="_blank"
                rel="noopener noreferrer"
                title="Mon CV (PDF)"
              >
                <img data-src="media/logos/cv.svg" alt="CV" class="footer-icon" loading="lazy" />
              </a>
            </div>
          </div>
        </div>

        <p class="footer-bottom">
          © <span class="footer-year"></span> Vincent Thorin<span id="version"></span>
        </p>
      </footer>
    `;

    // Chemins relatifs à la racine du site, valables depuis n'importe quelle page
    this.querySelectorAll("[data-src]").forEach((img) => {
      img.src = new URL(img.dataset.src, SITE_ROOT).href;
    });
    this.querySelectorAll("[data-href]").forEach((link) => {
      link.href = new URL(link.dataset.href, SITE_ROOT).href;
    });

    // Sur l'accueil : simple ancre. Ailleurs : retour à l'accueil, à la bonne section
    this.querySelectorAll("[data-section]").forEach((link) => {
      const id = link.dataset.section;
      link.href = document.getElementById(id)
        ? `#${id}`
        : new URL(`index.html#${id}`, SITE_ROOT).href;
    });

    this.querySelector(".footer-year").textContent = new Date().getFullYear();

    this.afficherVersion();
  }

  // Numéro de version depuis la dernière release GitHub
  afficherVersion() {
    const versionElement = this.querySelector("#version");
    fetch("https://api.github.com/repos/VT-94/portfolio/releases/latest")
      .then((response) => {
        if (!response.ok) throw new Error("Impossible de récupérer la version");
        return response.json();
      })
      .then((data) => {
        versionElement.textContent = data.name || data.tag_name || "inconnue";
      })
      .catch(() => {
        versionElement.style.display = "none";
      });
  }
}

customElements.define("site-footer", SiteFooter);
