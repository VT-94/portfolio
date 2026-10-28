// Web Component pour le pied de page commun à toutes les pages

// Racine du site, déduite de l'emplacement de ce script (js/site-footer.js)
const SITE_ROOT = new URL("../", document.currentScript.src);

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
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
        <p>© Vincent Thorin</p>
        <p><span id="version"></span></p>
      </footer>
    `;

    // Chemins relatifs à la racine du site, valables depuis n'importe quelle page
    this.querySelectorAll("[data-src]").forEach((img) => {
      img.src = new URL(img.dataset.src, SITE_ROOT).href;
    });
    this.querySelectorAll("[data-href]").forEach((link) => {
      link.href = new URL(link.dataset.href, SITE_ROOT).href;
    });

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
