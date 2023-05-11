const optionTemplate = document.createElement('template');
optionTemplate.innerHTML = `
  <style>
    * {
      box-sizing: border-box;
    }
    :host {
      display: flex;
    }
    :host([disabled]) .option {
      opacity: 0.5;
      cursor: default;
      background-color: transparent !important;
    }
    
    .option {
      width: 100%;
      padding: 0.3rem 0.75rem;
      cursor: pointer;
      user-select: none;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      transition: background-color .3s ease;
    }
    .option.active {
      background-color: #dcdcdc !important;
    }
    .option:hover {
      background-color: #f0f0f0;
    }
  </style>
  <div class="option">
    <slot></slot>
  </div>
`;

class Option extends HTMLElement {
  nodes = new Map();

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.appendChild(optionTemplate.content.cloneNode(true));
    
    this.attachNodes();
  }

  attachNodes() {
    this.nodes.set('option', this.shadowRoot.querySelector('.option'));
  }

  attachHandlers() {
    const option = this.nodes.get('option');

    this.addEventListener('option-change', this.handleChange.bind(this));

    if (option) {
      option.addEventListener('click', this.handleClick.bind(this));
    }
  }

  handleChange() {
    this.renderActive();
  }

  handleClick() {
    if (this.hasAttribute('disabled')) {
      return;
    }

    const value = this.getAttribute('value');
    const parentValue = this.parentElement.getAttribute('value');

    this.dispatchEvent(new CustomEvent('custom-select', {
      detail: parentValue === value ? null : value,
      bubbles: true,
    }));
  }

  renderActive() {
    const option = this.nodes.get('option');

    if (!option) {
      return;
    }

    const value = this.getAttribute('value');
    const parentValue = this.parentElement.getAttribute('value');

    option.classList[value === parentValue ? 'add' : 'remove']('active');
  }

  connectedCallback() {
    this.attachHandlers();
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    switch (attr) {
      case 'value': {
        this.renderActive();
        break;
      }
      default: {
        break;
      }
    }
  }

  static get observedAttributes() {
    return ['value'];
  }
}

customElements.define('custom-option', Option);
