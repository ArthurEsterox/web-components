const modalContentTemplate = document.createElement('template');
modalContentTemplate.innerHTML = `
  <style>
    * {
      box-sizing: border-box;
    }
    :host {
      width: 100%;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      flex-direction: column;
      padding: 16px;
    }
  </style>

  <slot></slot>
`;

class ModalContent extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.appendChild(modalContentTemplate.content.cloneNode(true));
  }
}

customElements.define('custom-modal-content', ModalContent);
