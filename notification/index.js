const template = document.createElement('template');
template.innerHTML = `
  <style>
    * {
      box-sizing: border-box;
    }
    :host {
      position: fixed;
      bottom: 30px;
      left: 30px;
      display: flex;
      background-color: #ffffff;
      width: 350px;
      transform: translateY(100px);
      opacity: 0;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
      animation: notification-enter .3s ease forwards;
      transition: width .3s ease, bottom .3s ease;
    }
    :host(.minimize) {
      width: 250px;
      bottom: 0;
    }
    .hide {
      display: none !important;
    }
    .notification {
      box-sizing: border-box;
      position: relative;
      width: 100%;
      padding: 12px 16px;
      border-left: 5px solid #000000;
      display: flex;
      align-items: center;
    }
    .notification.minimize {
      padding: 5px 10px;
    }
    .notification.minimize .notification-message {
      max-width: 80%;
      font-size: 16px;
    }
    .notification.minimize .notification-image-wrapper,
    .notification.minimize .notification-header,
    .notification.minimize .notification-footer {
      display: none !important;
    }
    .notification.minimize .notification-size-toggle svg {
      transform: rotate(180deg);
    }
    .notification-content {
      width: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
    }
    .notification-header {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      word-break: break-word;
      max-width: 90%;
    }
    .notification-message {
      margin: 10px 0;
      font-size: 18px;
      word-break: break-word;
      max-width: 90%;
    }
    .notification-footer {
      margin: 0;
      font-size: 16px;
      word-break: break-word;
      max-width: 90%;
    }
    .notification-close, .notification-size-toggle {
      position: absolute;
      right: 15px;
      top: 2px;
      background: transparent;
      border: none;
      padding: 5px;
      cursor: pointer;
      outline: none;
    }
    .notification-size-toggle svg {
      transition: transform .3s ease;
    }
    .notification-image-wrapper {
      min-width: 30px;
      min-height: 30px;
      max-width: 75px;
      max-height: 75px;
      margin-right: 10px;
      transform: translateX(-3px);
    }
    .notification-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .notification-count {
      position: absolute;
      width: 30px;
      height: 30px;
      top: -15px;
      right: -15px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #2673bf;
      color: #ffffff;
      border-radius: 50%;
      border: 2px solid #ffffff;
      box-shadow: 0 0 3px rgb(0, 0, 0, 0.2);
      font-size: 14px;
      font-weight: 500;
    }

    @keyframes notification-enter {
      0% {
        transform: translateY(100px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes notification-leave {
      0% {
        transform: translateY(0);
        opacity: 1;
      }
      100% {
        transform: translateY(100px);
        opacity: 0;
      }
    }
  </style>

  <div class="notification">
    <div class="notification-content">
      <div class="notification-header">
        <slot name="header"></slot>
      </div>
      <div class="notification-message">
        <slot></slot>
      </div>
      <div class="notification-footer">
        <slot name="footer"></slot>
      </div>
    </div>

    <button class="notification-close hide">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" width="16" height="16"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg>
    </button>

    <button class="notification-size-toggle hide">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
    </button>

    <div class="notification-count"></div>
  </div>
`;

class Notification extends HTMLElement {
  nodes = new Map();
  minimized = false;
  minimizeTimeout = null;

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.attachNodes();
  }

  attachNodes() {
    this.nodes.set('notification', this.shadowRoot.querySelector('.notification'));
    this.nodes.set('notification-content', this.shadowRoot.querySelector('.notification-content'));
    this.nodes.set('notification-close', this.shadowRoot.querySelector('.notification-close'));
    this.nodes.set('notification-size-toggle', this.shadowRoot.querySelector('.notification-size-toggle'));
    this.nodes.set('notification-count', this.shadowRoot.querySelector('.notification-count'));
  }

  attachHandlers() {
    const close = this.nodes.get('notification-close');
    const toggleSize = this.nodes.get('notification-size-toggle');
    
    if (close) {
      close.addEventListener('click', this.handleClose.bind(this));
    }

    if (toggleSize) {
      toggleSize.addEventListener('click', this.handleToggleSize.bind(this));
    }
  }
  
  deattachTimeouts() {
    if (this.minimizeTimeout) {
      clearTimeout(this.minimizeTimeout);
    }
  }

  async handleClose() {
    this.style.animation = 'notification-leave .3s ease forwards';

    await Promise.allSettled(
      this.getAnimations().map((animation) => animation.finished)
    );

    this.dispatchEvent(new CustomEvent('delete'));
  }

  handleToggleSize() {
    this.minimized = !this.minimized;

    const isMinimized = this.minimized;

    if (isMinimized && this.minimizeTimeout) {
      clearTimeout(this.minimizeTimeout);
    }

    const notification = this.nodes.get('notification');

    const method = isMinimized ? 'add' : 'remove';

    this.classList[method]('minimize');
    notification.classList[method]('minimize');

    this.dispatchEvent(new CustomEvent(isMinimized ? 'minimize' : 'maximize'));
  }

  handleMinimizeTimeout(timeout) {
    if (this.getAttribute('hide-mode') !== 'minimize') {
      return;
    }

    const timeoutNumber = +timeout;

    if (isNaN(timeoutNumber)) {
      return;
    }

    this.minimizeTimeout = setTimeout(() => {
      this.handleToggleSize();

      this.minimizeTimeout = null;
    }, timeoutNumber);
  }

  renderBorderColor(color) {
    const element = this.nodes.get('notification');

    element.style.borderLeftColor = color;
  }

  renderImage(imgSrc) {
    const imageWrapperQueried = this.shadowRoot.querySelector('.notification-image-wrapper');

    if (imageWrapperQueried) {
      imageWrapperQueried.firstElementChild.setAttribute('src', imgSrc);
      return;
    }
    
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('notification-image-wrapper');

    imageWrapper.innerHTML = `
      <img src="${imgSrc}" alt="Notification" class="notification-image" />
    `;

    const element = this.nodes.get('notification');

    element.insertAdjacentElement('afterbegin', imageWrapper);
  }

  renderCount(count) {
    const element = this.nodes.get('notification-count');
    
    let countNumber = +count;

    element.classList[countNumber < 1 ? 'add' : 'remove']('hide');

    if (countNumber < 1) {
      return;
    }

    if (countNumber > 99) {
      countNumber = '99+';
    }

    element.textContent = countNumber;
  }

  renderCountColor(color) {
    const element = this.nodes.get('notification-count');

    element.style.backgroundColor = color;
  }
  
  renderHideMode(mode) {
    if (!mode || mode === 'none') {
      this.nodes.get('notification-close').classList.add('hide');
      this.nodes.get('notification-size-toggle').classList.add('hide');

      if (this.minimizeTimeout) {
        clearTimeout(this.minimizeTimeout);
      }

      return;
    }

    if (mode === 'minimize') {
      this.nodes.get('notification-close').classList.add('hide');
      this.nodes.get('notification-size-toggle').classList.remove('hide');
      return;
    }

    if (mode === 'hide') {
      this.nodes.get('notification-size-toggle').classList.add('hide');
      this.nodes.get('notification-close').classList.remove('hide');

      if (this.minimizeTimeout) {
        clearTimeout(this.minimizeTimeout);
      }

      return;
    }
  }

  connectedCallback() {
    this.attachHandlers();
  }

  disconnectedCallback() {
    this.deattachTimeouts();
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    switch (attr) {
      case 'border-color': {
        this.renderBorderColor(newValue);
        break;
      }
      case 'image': {
        this.renderImage(newValue);
        break;
      }
      case 'hide-mode': {
        this.renderHideMode(newValue);
        break;
      }
      case 'count': {
        this.renderCount(newValue)
        break;
      }
      case 'count-color': {
        this.renderCountColor(newValue);
        break;
      }
      case 'minimize-timeout': {
        this.handleMinimizeTimeout(newValue);
        break;
      }
      default: {
        break;
      }
    }
  }

  static get observedAttributes() {
    return ['image', 'count', 'hide-mode', 'minimize-timeout', 'border-color', 'count-color'];
  }
}

customElements.define('custom-notification', Notification);
