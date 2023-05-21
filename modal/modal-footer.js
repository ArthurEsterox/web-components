const modalFooterTemplate = document.createElement('template');
modalFooterTemplate.innerHTML = `
  <style>
    * {
      box-sizing: border-box;
    }
    :host {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      width: 100%;
      padding: 16px;
    }

    .modal-footer-button {
      padding: 8px 15px;
      cursor: pointer;
      border: none;
      outline: none;
      background-color: transparent;
      font-family: inherit;
      font-size: 16px;
      font-weight: 500;
      line-height: initial;
      border-radius: 4px;
      color: #ffffff;
      transition: background-color .15s ease;
    }

    .modal-footer-submit {
      order: 1;
      background-color: #007bff;
    }
    .modal-footer-submit:hover {
      background-color: #0069d9;
    }

    .modal-footer-cancel {
      order: 0;
      background-color: #dc3545;
    }
    .modal-footer-cancel:hover {
      background-color: #c82333;
    }
  </style>
`;

class ModalFooter extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.appendChild(modalFooterTemplate.content.cloneNode(true));
  }

  renderButton(value, className, clickHandler) {
    const renderedButton = this.shadowRoot.querySelector(className);

    if (renderedButton) {
      if (value === null) {
        renderedButton.remove();
        return;
      }

      renderedButton.innerHTML = value;

      return;
    }

    if (value === null) {
      return;
    }

    const button = document.createElement('button');
    button.classList.add('modal-footer-button');
    className && button.classList.add(className);
    button.innerHTML = value;

    button.addEventListener('click', clickHandler);

    this.shadowRoot.appendChild(button);
  }

  handleClose() {
    this.dispatchEvent(new CustomEvent('close', {
      bubbles: true,
    }));
  }

  handleSubmit() {
    this.dispatchEvent(new CustomEvent('modal-submit', {
      bubbles: true,
    }));
  }

  renderCancel(value) {
    this.renderButton(value, 'modal-footer-cancel', this.handleClose.bind(this));
  }

  renderSubmit(value) {
    this.renderButton(value, 'modal-footer-submit', this.handleSubmit.bind(this));
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    switch (attr) {
      case 'cancel': {
        this.renderCancel(newValue);
        break;
      }
      case 'submit': {
        this.renderSubmit(newValue);
        break;
      }
      default: {
        break;
      }
    }
  }

  static get observedAttributes() {
    return ['cancel', 'submit'];
  }
}

customElements.define('custom-modal-footer', ModalFooter);
