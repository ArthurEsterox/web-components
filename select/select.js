const template = document.createElement('template');
template.innerHTML = `
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
    :host([disabled]) .select {
      cursor: default;
    }

    .select {
      width: 100%;
      outline: none;
      border: none;
      padding: 0.5rem 0.75rem;
      border-radius: 4px;
      background-color: #ffffff;
      cursor: pointer;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: border-radius .3s ease, box-shadow .3s ease;
    }
    .select.open {
      border-radius: 4px 4px 0 0;
    }
    .select.open .select-arrow {
      transform: rotate(180deg);
    }
    .select:focus-visible {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    }

    .select-placeholder {
      font-size: 16px;
      font-weight: 400;
      user-select: none;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      max-width: 80%;
    }
    .select-arrow {
      margin-bottom: 1px;
      transition: transform .3s ease;
    }
    .select-popup {
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
    .select-popup.open {
      z-index: 1;
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .select-popup-empty {
      width: 100%;
      font-size: 18px;
      font-weight: 500;
      text-align: center;
      padding: 10px;
      user-select: none;
    }
  </style>
  <button class="select">
    <span class="select-placeholder"></span>

    <svg class="select-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
  </button>
  <div class="select-popup">
    <span class="select-popup-empty hide">
      Empty
    </span>

    <slot></slot>
  </div>
`;

class Select extends HTMLElement {
  nodes = new Map();
  open = false;
  focused = -1;

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    this.attachNodes();

    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
  }

  attachNodes() {
    this.nodes.set('select', this.shadowRoot.querySelector('.select'));
    this.nodes.set('select-popup', this.shadowRoot.querySelector('.select-popup'));
    this.nodes.set('select-placeholder', this.shadowRoot.querySelector('.select-placeholder'));
    this.nodes.set('select-popup-empty', this.shadowRoot.querySelector('.select-popup-empty'));
  }

  attachHandlers() {
    const select = this.nodes.get('select');

    document.addEventListener('click', this.handleDocumentClick);
    document.addEventListener('keydown', this.handleDocumentKeyDown);

    this.addEventListener('custom-select', this.handleSelect.bind(this));

    if (select) {
      select.addEventListener('click', this.handleClick.bind(this));
    }
  }

  deattachHandlers() {
    document.removeEventListener('click', this.handleDocumentClick);
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
  }

  handleDocumentClick(e) {
    if (this.contains(e.target)) {
      return;
    }
    
    if (this.open) {
      this.toggleOpen();
    }
  }

  handleDocumentKeyDown(e) {
    if (!this.open) {
      return;
    }

    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
      return;
    }

    e.preventDefault();

    const options = this.getOptionElements();

    const activeOption = options.findIndex((option) => option === document.activeElement);
    
    if (activeOption > -1) {
      this.focused = activeOption;
    }

    if (e.key === 'ArrowUp') {
      if (this.focused > 0) {
        this.focused -= 1;
      } else {
        this.focused = options.length - 1;
      }
    } else if (e.key === 'ArrowDown') {
      if (this.focused >= (options.length - 1)) {
        this.focused = 0;
      } else {
        this.focused += 1;
      }
    }

    this.handleFocus(options[this.focused]);
  }

  handleFocus(option) {
    if (option) {
      option.dispatchEvent(new CustomEvent('option-focus'));
    }
  }

  handleSelect(e) {
    this.setAttribute('value', e.detail);
  }

  handleClick() {
    if (this.hasAttribute('disabled')) {
      return;
    }

    this.toggleOpen();
  }

  toggleOpen() {
    this.open = !this.open;

    const isOpen = this.open;

    const select = this.nodes.get('select');
    const selectPopup = this.nodes.get('select-popup');

    const method = isOpen ? 'add' : 'remove';

    select.classList[method]('open');
    selectPopup.classList[method]('open');
  }

  getOptionElements() {
    return Array.from(this.querySelectorAll('custom-option'));
  }

  getOptions() {
    return Array.from(this.children, (element) => {
      return {
        value: element.getAttribute('value'),
        content: element.innerHTML,
      };
    });
  }

  dispatchOptionChange() {
    this.querySelectorAll('custom-option').forEach((option) => {
      option.dispatchEvent(new CustomEvent('option-change'));
    });
  }

  renderPlaceholder(placeholder) {
    const selectPlaceholder = this.nodes.get('select-placeholder');

    if (selectPlaceholder) {
      selectPlaceholder.textContent = placeholder;
    }
  }

  renderValue(value) {
    const selectPlaceholder = this.nodes.get('select-placeholder');

    if (!selectPlaceholder) {
      return;
    }

    const options = this.getOptions();

    const foundOption = options.find((option) => option.value === value);

    selectPlaceholder.textContent = foundOption 
      ? foundOption.content 
      : this.getAttribute('placeholder');

    this.dispatchOptionChange();

    if (this.open) {
      this.toggleOpen();
    }
  }

  renderEmpty() {
    const isEmpty = !this.children.length;
    const emptyElement = this.nodes.get('select-popup-empty');

    emptyElement.classList[isEmpty ? 'remove' : 'add']('hide');
  }

  renderDisabled(value) {
    const select = this.nodes.get('select');

    if (!select) {
      return;
    }

    if (value === null) {
      select.setAttribute('tabindex', '0');
      return;
    }

    select.setAttribute('tabindex', '-1');
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
      case 'value': {
        this.renderValue(newValue);
        break;
      }
      case 'disabled': {
        this.renderDisabled(newValue);
        break;
      }
      default: {
        break;
      }
    }
  }

  static get observedAttributes() {
    return ['placeholder', 'value', 'disabled'];
  }
}

customElements.define('custom-select', Select);
