class SiteNav extends HTMLElement {
  connectedCallback() {
    const today = new Date().toLocaleDateString('fr-FR');
    this.innerHTML = `
      <nav class="bandeau">
        <ul>
          <li><a href="index.html#presentation">Présentation</a></li>
          <li><a href="index.html#realisations">Réalisations</a></li>
          <li><a href="index.html#parcours">Parcours</a></li>
          <li><a href="index.html#contact">Contact</a></li>
        </ul>
      </nav>
      <div class="bandeau-info">
        ⚠️ ${today} — Site en restructuration
      </div>
    `;
  }
}

customElements.define('site-nav', SiteNav);
