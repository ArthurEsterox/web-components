const checkboxTemplate = document.createElement('template');
checkboxTemplate.innerHTML = `
  <style>
    * {
      box-sizing: border-box;
    }

    :host {
      display: flex; 
    }

    :host([disabled]) .checkbox {
      border-color: #BDBDBD !important;
      cursor: default;
    }
    :host([disabled][checked]) .checkbox {
      background-color: #BDBDBD !important;
    }

    :host([checked]) .checkbox {
      background-color: #1976D2;
      border-color: #1976D2;
    }
    :host([checked]) .checkbox-mark {
      fill: #ffffff;
    }

    :host([checked][color="secondary"]) .checkbox {
      background-color: #9C27B0;
      border-color: #9C27B0;
    }
    :host([checked][color="warning"]) .checkbox {
      background-color: #ED6C02;
      border-color: #ED6C02;
    }
    :host([checked][color="error"]) .checkbox {
      background-color: #D32F2F;
      border-color: #D32F2F;
    }
    :host([checked][color="success"]) .checkbox {
      background-color: #2E7D32;
      border-color: #2E7D32;
    }
 
    .checkbox {
      position: relative;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 2px;
      background-color: transparent;
      border: 2px solid #626465;
      cursor: pointer;
      transition: border-color .3s ease, background-color .3s ease;
    }
    .checkbox-mark {
      position: absolute;
      fill: transparent;
      transition: fill .3s ease;
    }
  </style>

  <div class="checkbox">
    <svg class="checkbox-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" width="16px" height="16px"><path xmlns="http://www.w3.org/2000/svg" d="M378 815q-9 0-17.5-3.5T345 801L164 620q-14-14-14-34t14-34q14-14 33.5-14t34.5 14l146 146 350-349q14-14 33.5-14.5T795 349q14 14 14 34t-14 34L411 801q-7 7-15.5 10.5T378 815Z"/></svg>
  </div>
`;

class Checkbox extends HTMLElement {
  nodes = new Map();

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.appendChild(checkboxTemplate.content.cloneNode(true));

    this.attachNodes();
  }

  attachNodes() {
    this.nodes.set('checkbox', this.shadowRoot.querySelector('.checkbox'));
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

customElements.define('custom-checkbox', Checkbox);
