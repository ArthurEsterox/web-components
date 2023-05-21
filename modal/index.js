const modalTemplate = document.createElement('template');
modalTemplate.innerHTML = `
  <style>
    * {
      box-sizing: border-box;
    }
    :host {
      display: block;
      position: fixed;
      z-index: 1000;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.6);
      overflow-y: auto;
      animation: enter-overlay .3s ease forwards;
    }

    :host(.close) {
      animation: leave-overlay .3s ease forwards;
    }
    :host(.close) .modal-content {
      animation: leave-content .3s ease forwards;
    }

    .modal-content-wrapper {
      min-height: 100%;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
    .modal-content {
      position: relative;
      max-width: 700px;
      width: 100%;
      border-radius: 6.6px;
      min-height: 1rem;
      margin: 40px 0;
      z-index: 1000;
      background-color: #ffffff;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      animation: enter-content .3s ease forwards;
    }

    @keyframes enter-content {
      0% {
        transform: scale(0.6);
        opacity: 0;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    
    @keyframes enter-overlay {
      0% {
        background-color: rgba(0, 0, 0, 0);
      }
      100% {
        background-color: rgba(0, 0, 0, 0.6);
      }
    }

    @keyframes leave-content {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      100% {
        transform: scale(0.6);
        opacity: 0;
      }
    }

    @keyframes leave-overlay {
      0% {
        background-color: rgba(0, 0, 0, 0.6);
      }
      100% {
        background-color: rgba(0, 0, 0, 0);
      }
    }
  </style>

  <div class="modal-content-wrapper">
    <div class="modal-content">
      <slot></slot>
    </div>
  </div>
`;

class Modal extends HTMLElement {
  nodes = new Map();

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.appendChild(modalTemplate.content.cloneNode(true));

    this.attachNodes();

    this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
  }

  attachNodes() {
    this.nodes.set('modal-content-wrapper', this.shadowRoot.querySelector('.modal-content-wrapper'));
    this.nodes.set('modal-content', this.shadowRoot.querySelector('.modal-content'));
  }

  attachHandlers() {
    const modalContentWrapper = this.nodes.get('modal-content-wrapper');

    document.addEventListener('keydown', this.handleDocumentKeyDown);

    this.addEventListener('close', this.close.bind(this));

    if (modalContentWrapper) {
      modalContentWrapper.addEventListener('click', this.handleClick.bind(this));
    }
  }
  
  deattachHandlers() {
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
  }

  handleDocumentKeyDown(e) {
    // esc click
    if (e.keyCode === 27) {
      this.close();
    }
  }

  handleClick(e) {
    if (e.target === e.currentTarget) {
      this.close();
    }
  }

  async close() {
    this.classList.add('close');

    await Promise.allSettled(
      this.getAnimations().map((animation) => animation.finished)
    );

    this.dispatchEvent(new CustomEvent('delete'));
  }

  connectedCallback() {
    this.attachHandlers();
  }

  disconnectedCallback() {
    this.deattachHandlers();
  }
}

customElements.define('custom-modal', Modal);
