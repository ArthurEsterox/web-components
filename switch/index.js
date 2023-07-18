const switchTemplate = document.createElement('template');
switchTemplate.innerHTML = `
  <style>
    * {
      box-sizing: border-box;
    }
    :host {
      display: flex;
      width: fit-content;
    }

    :host([disabled]) .switch {
      cursor: default;
    }
    :host([disabled]) .switch-track {
      opacity: 0.12 !important;
    }
    :host([disabled]) .switch-thumb {
      background-color: #f5f5f5;
    }
    :host([checked][disabled]) .switch-thumb {
      background-color: rgb(167, 202, 237);
    }
    :host([checked][disabled][color="secondary"]) .switch-thumb {
      background-color: rgb(217, 172, 224);
    }
    :host([checked][disabled][color="warning"]) .switch-thumb {
      background-color: rgb(248, 199, 158);
    }
    :host([checked][disabled][color="error"]) .switch-thumb {
      background-color: rgb(238, 175, 175);
    }

    :host([checked]) .switch-track {
      opacity: 0.5;
      background-color: #1976d2;
    }
    :host([checked]) .switch-thumb {
      background-color: #1976d2;
      transform: translateX(20px);
    }

    :host([checked][color="secondary"]) .switch-track {
      background-color: #9c27b0;
    }
    :host([checked][color="secondary"]) .switch-thumb {
      background-color: #9c27b0;
    }

    :host([checked][color="warning"]) .switch-track {
      background-color: #ed6c02;
    }
    :host([checked][color="warning"]) .switch-thumb {
      background-color: #ed6c02;
    }

    :host([checked][color="error"]) .switch-track {
      background-color: #d32f2f;
    }
    :host([checked][color="error"]) .switch-thumb {
      background-color: #d32f2f;
    }

    .switch {
      position: relative;
      display: flex;
      width: 34px;
      height: 14px;
      padding: 0;
      outline: none;
      border: none;
      cursor: pointer;
      background-color: transparent;
    }
    .switch:focus-visible .switch-thumb {
      box-shadow: 0 0 25px #000;
    }
    .switch-track {
      background-color: #000000;
      opacity: 0.38;
      width: 100%;
      height: 100%;
      border-radius: 7px;
      transition: opacity .15s ease, background-color .15s ease;
    }
    .switch-thumb {
      position: absolute;
      top: -3px;
      width: 20px;
      height: 20px;
      background-color: #ffffff;
      border-radius: 50%;
      transform: translateX(-2px);
      box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
      transition: background-color .15s ease, transform .15s ease, box-shadow .15s ease;
    }
  </style>
  
  <button type="button" class="switch" role="switch" aria-checked="false" tabindex="0">
    <div class="switch-track" aria-hidden="true"></div>
    <div class="switch-thumb" aria-hidden="true"></div>
  </button>
`;

class Switch extends HTMLElement {
  nodes = new Map();

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.appendChild(switchTemplate.content.cloneNode(true));

    this.attachNodes();
  }

  attachNodes() {
    this.nodes.set('switch', this.shadowRoot.querySelector('.switch'));
    this.nodes.set('switch-track', this.shadowRoot.querySelector('.switch-track'));
    this.nodes.set('switch-thumb', this.shadowRoot.querySelector('.switch-thumb'));
  }

  attachHandlers() {
    const switchButton = this.nodes.get('switch');

    if (switchButton) {
      switchButton.addEventListener('click', this.handleClick.bind(this));
    }
  }

  handleClick() {
    const isDisabled = this.hasAttribute('disabled');

    if (isDisabled) {
      return;
    }
    
    const isChecked = !this.hasAttribute('checked');

    this.dispatchEvent(new CustomEvent('check', {
      detail: isChecked,
    }));

    if (!isChecked) {
      return this.removeAttribute('checked');
    }

    this.setAttribute('checked', '');
  }

  renderDisabled(value) {
    const switchButton = this.nodes.get('switch');

    if (!switchButton) {
      return;
    }

    if (value === null) {
      switchButton.setAttribute('tabindex', '0');
      return;
    }

    switchButton.setAttribute('tabindex', '-1');
  }

  renderLabel(value) {
    const switchButton = this.nodes.get('switch');

    if (!switchButton) {
      return;
    }

    if (value === null) {
      switchButton.removeAttribute('aria-label');
      return;
    }

    switchButton.setAttribute('aria-label', value);
  }
  
  renderChecked(value) {
    const switchButton = this.nodes.get('switch');

    if (!switchButton) {
      return;
    }

    if (value === null) {
      switchButton.setAttribute('aria-checked', 'false');
      return;
    }

    switchButton.setAttribute('aria-checked', 'true');
  }

  connectedCallback() {
    this.attachHandlers();
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    switch (attr) {
      case 'disabled': {
        this.renderDisabled(newValue);
        break;
      }
      case 'label': {
        this.renderLabel(newValue);
        break;
      }
      case 'checked': {
        this.renderChecked(newValue);
        break;
      }
      default: {
        break;
      }
    }
  }

  static get observedAttributes() {
    return ['color', 'checked', 'disabled', 'label'];
  }
}

customElements.define('custom-switch', Switch);
