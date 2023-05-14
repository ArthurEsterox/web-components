const tooltipTemplate = document.createElement('template');
tooltipTemplate.innerHTML = `
  <style>
    * {
      box-sizing: border-box;
    }
    :host {
      display: block;
    }

    :host([open]) .tooltip-wrapper {
      opacity: 1;
      visibility: visible;
      transform: translate(0) scale(1) !important;
    }

    :host([position="top"]) .tooltip-wrapper,
    :host([position="top-start"]) .tooltip-wrapper,
    :host([position="top-end"]) .tooltip-wrapper {
      transform: translateY(5px) scale(0.6);
    }

    :host([position="left"]) .tooltip-wrapper,
    :host([position="left-start"]) .tooltip-wrapper,
    :host([position="left-end"]) .tooltip-wrapper {
      transform: translateX(20px) scale(0.6);
    }

    :host([position="bottom"]) .tooltip-wrapper,
    :host([position="bottom-start"]) .tooltip-wrapper,
    :host([position="bottom-end"]) .tooltip-wrapper {
      transform: translateY(-5px) scale(0.6);
    }

    :host([position="right"]) .tooltip-wrapper,
    :host([position="right-start"]) .tooltip-wrapper,
    :host([position="right-end"]) .tooltip-wrapper {
      transform: translateX(-20px) scale(0.6);
    }

    .tooltip-wrapper {
      position: fixed;
      z-index: 999;
      visibility: hidden;
      opacity: 0;
      transition: opacity .15s ease, transform .15s ease, visibility .15s ease;
    }
    .tooltip {
      background-color: rgba(97, 97, 97, 0.92);
      padding: 4px 8px;
      border-radius: 4px;
      max-width: 300px;
      font-size: 11px;
      font-weight: 500;
      color: #ffffff;
    }
  </style>

  <slot></slot>

  <div class="tooltip-wrapper">
    <div class="tooltip"></div>
  </div>
`;

class Tooltip extends HTMLElement {
  nodes = new Map();

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.appendChild(tooltipTemplate.content.cloneNode(true));

    this.attachNodes();

    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  attachNodes() {
    this.nodes.set('tooltip', this.shadowRoot.querySelector('.tooltip'));
    this.nodes.set('tooltip-wrapper', this.shadowRoot.querySelector('.tooltip-wrapper'));
  }

  attachHandlers() {
    document.addEventListener('click', this.handleDocumentClick);
    this.addEventListener('click', this.handleClick);
    this.addEventListener('mouseover', this.handleMouseOver.bind(this));  
    this.addEventListener('mouseout', this.handleMouseOut.bind(this));
  }

  deattachHandlers() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  handleDocumentClick(e) {
    if (this.getAttribute('trigger') !== 'click') {
      return;
    }

    if (this.contains(e.target)) {
      return;
    }
    
    if (this.hasAttribute('open')) {
      this.removeAttribute('open');
    }
  }

  handleClick(e) {
    if (this.getAttribute('trigger') !== 'click') {
      return;
    }

    if (this.hasAttribute('open')) {
      if (e.target === e.currentTarget) {
        return;
      }

      return this.removeAttribute('open');
    }

    this.setAttribute('open', '');
  }

  handleMouseOver() {
    if (this.getAttribute('trigger') === 'click') {
      return;
    }

    this.setAttribute('open', '');
  }

  handleMouseOut() {
    if (this.getAttribute('trigger') === 'click') {
      return;
    }

    this.removeAttribute('open');
  }

  renderPosition(position) {
    const tooltip = this.nodes.get('tooltip-wrapper');

    if (!tooltip) {
      return;
    }

    switch (position) {
      case 'top':
      case 'top-start':
      case 'top-end': {
        tooltip.style.paddingBottom = '10px';
        break;
      }

      case 'left':
      case 'left-start':
      case 'left-end': {
        tooltip.style.paddingRight = '10px';
        break;
      }

      case 'bottom':
      case 'bottom-start':
      case 'bottom-end': {
        tooltip.style.paddingTop = '10px';
        break;
      }

      case 'right':
      case 'right-start':
      case 'right-end': {
        tooltip.style.paddingLeft = '10px';
        break;
      }

      default: {
        break;
      }
    }
  }

  render(open) {
    if (open === null) {
      return;
    }

    const tooltip = this.nodes.get('tooltip-wrapper');

    if (!tooltip) {
      return;
    }

    const position = this.getAttribute('position');
    const rect = this.getBoundingClientRect();
    const tooltipStyles = getComputedStyle(tooltip);
    const tooltipWidth = parseFloat(tooltipStyles.width);
    const tooltipHeight = parseFloat(tooltipStyles.height);

    switch (position) {
      case 'top': {
        tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltipWidth / 2)}px`;
        tooltip.style.top = `${rect.top - tooltipHeight}px`;
        break;
      }
      case 'top-start': {
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.top - tooltipHeight}px`;
        break;
      }
      case 'top-end': {
        tooltip.style.left = `${(rect.left + rect.width) - tooltipWidth}px`;
        tooltip.style.top = `${rect.top - tooltipHeight}px`;
        break;
      }

      case 'left': {
        tooltip.style.left = `${rect.left - tooltipWidth}px`;
        tooltip.style.top = `${rect.top + (rect.height / 2) - (tooltipHeight / 2)}px`;
        break;
      }
      case 'left-start': {
        tooltip.style.left = `${rect.left - tooltipWidth}px`;
        tooltip.style.top = `${rect.top}px`;
        break;
      }
      case 'left-end': {
        tooltip.style.left = `${rect.left - tooltipWidth}px`;
        tooltip.style.top = `${rect.top + rect.height - tooltipHeight}px`;
        break;
      }

      case 'bottom': {
        tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltipWidth / 2)}px`;
        tooltip.style.top = `${rect.top + rect.height}px`;
        break;
      }
      case 'bottom-start': {
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.top + rect.height}px`;
        break;
      }
      case 'bottom-end': {
        tooltip.style.left = `${(rect.left + rect.width) - tooltipWidth}px`;
        tooltip.style.top = `${rect.top + rect.height}px`;
        break;
      }

      case 'right': {
        tooltip.style.left = `${rect.left + rect.width}px`;
        tooltip.style.top = `${rect.top + (rect.height / 2) - (tooltipHeight / 2)}px`;
        break;
      }
      case 'right-start': {
        tooltip.style.left = `${rect.left + rect.width}px`;
        tooltip.style.top = `${rect.top}px`;
        break;
      }
      case 'right-end': {
        tooltip.style.left = `${rect.left + rect.width}px`;
        tooltip.style.top = `${rect.top + rect.height - tooltipHeight}px`;
        break;
      }

      default: {
        tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltipWidth / 2)}px`;
        tooltip.style.top = `${rect.top - tooltipHeight}px`;
        break;
      }
    }
  }

  renderText(text) {
    const tooltip = this.nodes.get('tooltip');

    if (tooltip) {
      tooltip.textContent = text || '';
    }
  }

  initializePosition() {
    if (!this.hasAttribute('position')) {
      this.setAttribute('position', 'top');
    }
  }

  initializeTrigger() {
    if (
      !this.hasAttribute('trigger') &&
      !window.matchMedia('(pointer: fine)').matches
    ) {
      this.setAttribute('trigger', 'click');
    }
  }

  connectedCallback() {
    this.attachHandlers();
    this.initializePosition();
    this.initializeTrigger();
  }

  disconnectedCallback() {
    this.deattachHandlers();
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    switch (attr) {
      case 'open': {
        this.render(newValue);
        break;
      }
      case 'text': {
        this.renderText(newValue);
        break;
      }
      case 'position': {
        this.renderPosition(newValue);
        break;
      }
      default: {
        break;
      }
    }
  }

  static get observedAttributes() {
    return ['open', 'text', 'position'];
  }
}

customElements.define('custom-tooltip', Tooltip);
