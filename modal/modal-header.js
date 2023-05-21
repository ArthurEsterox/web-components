const modalHeaderTemplate = document.createElement('template');
modalHeaderTemplate.innerHTML = `
  <style>
    * {
      box-sizing: border-box;
    }
    :host {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
    }

    .modal-title {
      font-size: 24px;
      font-weight: 700;
      max-width: 80%;
      word-break: break-word;
    }
    .modal-close {
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: transparent;
      outline: none;
      border: none;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      transition: background-color .15s ease;
    }
    .modal-close:hover {
      background-color: rgba(0, 0, 0, 0.15);
    }
    .modal-close:active {
      background-color: rgba(0, 0, 0, 0.25);
    }
  </style>

  <div class="modal-title">
    <slot></slot>
  </div>

  <button class="modal-close">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" width="20" height="20"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg>
  </div>
`;

class ModalHeader extends HTMLElement {
  nodes = new Map();

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.appendChild(modalHeaderTemplate.content.cloneNode(true));

    this.attachNodes();
  }

  attachNodes() {
    this.nodes.set('modal-title', this.shadowRoot.querySelector('.modal-title'));
    this.nodes.set('modal-close', this.shadowRoot.querySelector('.modal-close'));
  }

  attachHandlers() {
    const close = this.nodes.get('modal-close');

    if (close) {
      close.addEventListener('click', this.handleClose.bind(this));
    }
  }

  handleClose() {
    this.dispatchEvent(new CustomEvent('close', {
      bubbles: true,
    }));
  }

  connectedCallback() {
    this.attachHandlers();
  }
}

customElements.define('custom-modal-header', ModalHeader);
