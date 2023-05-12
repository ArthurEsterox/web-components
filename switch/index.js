const switchTemplate = document.createElement('template');
switchTemplate.innerHTML = `
  <style>
    * {
      box-sizing: border-box;
    }
    :host {
      display: flex;
      width: fit-content;
      cursor: pointer;
    }

    :host([disabled]) {
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
      transition: background-color .15s ease, transform .15s ease;
    }
  </style>
  
  <div class="switch">
    <div class="switch-track"></div>
    <div class="switch-thumb"></div>
  </div>
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
  }

  attachHandlers() {
    this.addEventListener('click', this.handleClick.bind(this));
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

  connectedCallback() {
    this.attachHandlers();
  }

  static get observedAttributes() {
    return ['color', 'checked', 'disabled'];
  }
}

customElements.define('custom-switch', Switch);
