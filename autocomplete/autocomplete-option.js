const autocompleteOptionTemplate = document.createElement('template');
autocompleteOptionTemplate.innerHTML = `
  <style>
    * {
      box-sizing: border-box;
    }
    :host {
      display: flex;
    }
    :host([hide]) {
      display: none !important;
    }
    :host([disabled]) .autocomplete-option {
      opacity: 0.5;
      cursor: default;
      background-color: transparent !important;
    }

    :host([active]) .autocomplete-option {
      background-color: #dcdcdc !important;
    }

    .autocomplete-option {
      width: 100%;
      padding: 0.3rem 0.75rem;
      cursor: pointer;
      user-select: none;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      transition: background-color .3s ease;
    }
    .autocomplete-option:hover {
      background-color: #f0f0f0;
    }
  </style>

  <div class="autocomplete-option">
    <slot></slot>
  </div>
`;

class AutocompleteOption extends HTMLElement {
  nodes = new Map();

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.appendChild(autocompleteOptionTemplate.content.cloneNode(true));

    this.attachNodes();
  }

  attachNodes() {
    this.nodes.set('autocomplete-option', this.shadowRoot.querySelector('.autocomplete-option'));
  }

  attachHandlers() {
    const option = this.nodes.get('autocomplete-option');

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

    const value = this.innerHTML;
    const parentValue = this.parentElement.getAttribute('value');

    this.dispatchEvent(new CustomEvent('auto-select', {
      detail: parentValue === value ? null : value,
      bubbles: true,
    }));
  }

  renderActive() {
    const option = this.nodes.get('autocomplete-option');

    if (!option) {
      return;
    }

    const value = this.innerHTML.toLowerCase();
    const parentValue = this.parentElement.selected?.toLowerCase();

    if (value === parentValue) {
      this.setAttribute('active', '');
    } else {
      this.removeAttribute('active');
    }
  }

  connectedCallback() {
    this.attachHandlers();
  }
}

customElements.define('auto-complete-option', AutocompleteOption);
