const autocompleteTemplate = document.createElement('template');
autocompleteTemplate.innerHTML = `
  <style>
    * {
      box-sizing: border-box;
    }
    .hide {
      display: none !important;
    }
    :host {
      position: relative;
      z-index: 1;
      display: flex;
    }
    :host([disabled]) {
      opacity: 0.5;
    }
    :host([disabled]) .autocomplete,
    :host([disabled]) .autocomplete-input {
      cursor: default !important;
    }
    
    :host([open]) .autocomplete {
      border-radius: 4px 4px 0 0;
    }
    :host([open]) .autocomplete-arrow {
      transform: rotate(180deg);
    }
    :host([open]) .autocomplete-popup {
      z-index: 1;
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .autocomplete {
      width: 100%;
      border-radius: 4px;
      background-color: #ffffff;
      cursor: text;
      padding-right: 0.75rem;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: border-radius .3s ease;
    }
    .autocomplete-input {
      width: calc(100% - 30px);
      font-size: 16px;
      outline: none;
      border: none;
      background-color: transparent;
      padding: 0.5rem 0.75rem;
    }
    .autocomplete-input::placeholder {
      font-size: 16px;
      color: rgb(80, 80, 80);
    }
    .autocomplete-arrow {
      margin-bottom: 1px;
      fill: rgb(80, 80, 80);
      transition: transform .3s ease;
    }

    .autocomplete-popup {
      position: absolute;
      top: 100%;
      width: 100%;
      background-color: #ffffff;
      border-radius: 0 0 4px 4px;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      z-index: -1;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      max-height: 220px;
      overflow-y: auto;
      transition: transform .3s ease, opacity .3s ease, visibility .3s ease;
    }
    .autocomplete-popup-empty {
      width: 100%;
      font-size: 16px;
      font-weight: 500;
      color: rgb(80, 80, 80);
      padding: 10px;
      user-select: none;
    }
  </style>

  <div class="autocomplete">
    <input class="autocomplete-input" />

    <svg class="autocomplete-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
  </div>

  <div class="autocomplete-popup">
    <div class="autocomplete-popup-empty hide">
      No Options
    </div>

    <slot></slot>
  </div>
`;

class Autocomplete extends HTMLElement {
  nodes = new Map();
  selected = null;

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.appendChild(autocompleteTemplate.content.cloneNode(true));

    this.attachNodes();

    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  attachNodes() {
    this.nodes.set('autocomplete', this.shadowRoot.querySelector('.autocomplete'));
    this.nodes.set('autocomplete-popup', this.shadowRoot.querySelector('.autocomplete-popup'));
    this.nodes.set('autocomplete-input', this.shadowRoot.querySelector('.autocomplete-input'));
    this.nodes.set('autocomplete-popup-empty', this.shadowRoot.querySelector('.autocomplete-popup-empty'));
  }

  attachHandlers() {
    const autocomplete = this.nodes.get('autocomplete');
    const input = this.nodes.get('autocomplete-input');

    document.addEventListener('click', this.handleDocumentClick);

    this.addEventListener('auto-select', this.handleSelect.bind(this));

    if (autocomplete) {
      autocomplete.addEventListener('click', this.handleClick.bind(this));
    }

    if (input) {
      input.addEventListener('input', this.handleInput.bind(this));
      input.addEventListener('focus', this.handleFocus.bind(this));
    }
  }

  deattachHandlers() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  handleDocumentClick(e) {
    if (this.contains(e.target)) {
      return;
    }
    
    if (this.open) {
      this.handleOutsideClick();
    }
  }

  handleClick() {
    if (this.hasAttribute('disabled')) {
      return;
    }

    if (document.activeElement === this && !this.open) {
      this.open = '';
    }

    this.focus();
  }

  handleSelect(e) {
    this.focus();

    this.value = e.detail;
    this.selected = e.detail;

    this.renderOptions(e.detail);
    this.open = false;
  }

  handleFocus() {
    if (this.hasAttribute('disabled')) {
      return;
    }

    this.open = '';
  }

  handleOutsideClick() {
    if (!this.open) {
      return;
    }

    this.open = false;
    
    if (this.value !== this.selected) {
      if (this.selected) {
        this.value = this.selected;
        this.renderOptions(this.selected);
        this.renderEmpty();
        return;
      }

      this.value = '';
      this.selected = null;
      this.renderOptions('');
      this.renderEmpty();
    }
  }

  handleInput(e) {
    const value = e.target.value;

    if (!value.trim()) {
      this.selected = null;
    }

    this.renderOptions(value);
    this.renderEmpty();
  }

  focus() {
    this.nodes.get('autocomplete-input')?.focus?.();
  }

  getOptions() {
    return Array.from(this.children, (element) => {
      return {
        value: element.getAttribute('value'),
        content: element.innerHTML,
      };
    });
  }

  renderPlaceholder(placeholder) {
    const input = this.nodes.get('autocomplete-input');

    if (input) {
      input.setAttribute('placeholder', placeholder || '');
    }
  }

  renderDisabled(disabled) {
    const input = this.nodes.get('autocomplete-input');

    if (disabled === null) {
      return input.removeAttribute('disabled');
    }

    input.setAttribute('disabled', '');
  }

  renderOptions(value) {
    for (let i = 0; i < this.children.length; i++) {
      const option = this.children.item(i);

      option.dispatchEvent(new CustomEvent('option-change'));

      if (!option.innerHTML.toLowerCase().includes(value.toLowerCase())) {
        option.setAttribute('hide', '');
      } else {
        option.removeAttribute('hide', '');
      }
    }
  }

  renderEmpty() {
    const length = this.children.length;
    let hasVisible = null;

    if (!length) {
      hasVisible = false;
    }

    if (hasVisible === null) {
      for (let i = 0; i < length; i++) {
        const option = this.children.item(i);
  
        if (!option.hasAttribute('hide')) {
          hasVisible = true;
          break;
        }
      }
    }

    const empty = this.nodes.get('autocomplete-popup-empty');

    empty.classList[hasVisible ? 'add' : 'remove']('hide');
  }

  connectedCallback() {
    this.attachHandlers();
    this.renderEmpty();
  }

  disconnectedCallback() {
    this.deattachHandlers();
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    switch (attr) {
      case 'placeholder': {
        this.renderPlaceholder(newValue);
        break;
      }
      case 'disabled': {
        this.renderDisabled();
        break;
      }
      default: {
        break;
      }
    }
  }

  static get observedAttributes() {
    return ['placeholder', 'disabled'];
  }

  get value() {
    return this.nodes.get('autocomplete-input')?.value || '';
  }

  set value(newValue) {
    const input = this.nodes.get('autocomplete-input');

    if (input) {
      this.nodes.get('autocomplete-input').value = newValue;
    }
  }

  get open() {
    return this.hasAttribute('open');
  }

  set open(value) {
    if (value === false) {
      this.removeAttribute('open');
      return;
    }

    this.setAttribute('open', value);
  }
}

customElements.define('auto-complete', Autocomplete);
