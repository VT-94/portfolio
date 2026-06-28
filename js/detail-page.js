// Web Component pour les pages de détail des réalisations
class DetailPage extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || 'Réalisation';
    const subtitle = this.getAttribute('subtitle') || '';
    const imageSrc = this.getAttribute('image-src') || '';
    const imageAlt = this.getAttribute('image-alt') || 'Image';
    const backLink = this.getAttribute('back-link') || '../index.html#realisations';

    // Récupérer et STOCKER le contenu des slots AVANT de modifier innerHTML
    const descriptionSlot = this.querySelector('[slot="description"]');
    const contentSlot = this.querySelector('[slot="content"]');
    
    const descriptionContent = descriptionSlot ? descriptionSlot.innerHTML : '';
    const contentContent = contentSlot ? contentSlot.innerHTML : '';

    const template = `
      <div class="detail-container">
        <header class="detail-header">
          <h1>${title}</h1>
          <p class="subtitle">${subtitle}</p>
        </header>

        <div class="detail-content">
          ${descriptionContent ? '<section class="detail-section"><h2>Présentation</h2>' + descriptionContent + '</section>' : ''}

          <div class="detail-image-container">
            <img 
              src="${imageSrc}" 
              alt="${imageAlt}"
              class="detail-image"
            />
          </div>

          ${contentContent ? '<section class="detail-section"><h2>À propos de ce projet</h2>' + contentContent + '</section>' : ''}
        </div>

        <footer class="detail-footer">
          <a href="${backLink}" class="back-link">← Retour aux réalisations</a>
        </footer>
      </div>
    `;

    this.innerHTML = template;
  }
}

customElements.define('detail-page', DetailPage);
