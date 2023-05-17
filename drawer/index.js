const drawerTemplate = document.createElement('template');
drawerTemplate.innerHTML = `
  <style>
    * {
      box-sizing: border-box;
    }
    :host {
      display: flex;
    }
    :host([open]) .drawer-overlay {
      z-index: 999;
      background-color: rgba(0, 0, 0, 0.45);
    }
    :host([open]) .drawer {
      z-index: 999;
      transform: translateX(0) !important;
    }

    :host([position="right"]) .drawer {
      top: 0;
      left: initial;
      right: 0;
      transform: translateX(270px);
    }

    .drawer-overlay {
      position: fixed;
      z-index: -1;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0);
      transition: background-color .3s ease, z-index .3s ease;
    }
    .drawer {
      position: absolute;
      z-index: -1;
      top: 0;
      left: 0;
      width: 270px;
      height: 100vh;
      transform: translateX(-270px);
      overflow-x: hidden;
      overflow-y: auto;
      background-color: #ffffff;
      transition: transform .3s ease;
    }

    @media (max-width: 300px) {
      .drawer {
        width: 100vw;
      }
      .drawer-overlay {
        background-color: rgba(0, 0, 0, 0) !important;
      }
    }
  </style>

  <div class="drawer-overlay">
    <div class="drawer">
      <slot></slot>
    </div>
  </div>
`;

class Drawer extends HTMLElement {
  touchStart = 0;

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.appendChild(drawerTemplate.content.cloneNode(true));

    this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  attachHandlers() {
    document.addEventListener('keydown', this.handleDocumentKeyDown);

    this.shadowRoot.addEventListener('click', this.handleClick.bind(this));
  }

  deattachHandlers() {
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
    document.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('touchend', this.handleTouchEnd);
  }

  handleClick(e) {
    if (e.target?.classList?.contains('drawer-overlay')) {
      this.close();
    }
  }

  handleDocumentKeyDown(e) {
    // esc click
    if (e.keyCode === 27) {
      this.close();
    }
  }

  handleTouchStart(e) {
    this.touchStart = e.changedTouches[0].clientX;
  }

  handleTouchEnd(e) {
    const touchEnd = e.changedTouches[0].clientX;

    const right = this.getAttribute('position') === 'right';

    if (!this.hasAttribute('open')) {
      if (right) {
        const width = window.innerWidth - 30;

        if (this.touchStart > width && touchEnd < (width - 60)) {
          this.open();
        }
      } else {
        if (this.touchStart < 10 && touchEnd > 100) {
          this.open();
        }
      }
    } else {
      if (right) {
        if (this.touchStart + 90 < touchEnd) {
          this.close();
        }
      } else {
        if (this.touchStart - 90 > touchEnd) {
          this.close();
        }
      }
    }
  }

  initializeSwipeable(swipeable) {
    if (swipeable === null) {
      document.removeEventListener('touchstart', this.handleTouchStart);
      document.removeEventListener('touchend', this.handleTouchEnd);

      return;
    }

    document.addEventListener('touchstart', this.handleTouchStart);
    document.addEventListener('touchend', this.handleTouchEnd);
  }

  open() {
    this.setAttribute('open', '');

    this.dispatchEvent(new CustomEvent('open'));
  }

  close() {
    this.removeAttribute('open');

    this.dispatchEvent(new CustomEvent('close'));
  }

  connectedCallback() {
    this.attachHandlers();
  }

  disconnectedCallback() {
    this.deattachHandlers();
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    switch (attr) {
      case 'swipeable': {
        this.initializeSwipeable(newValue);
        break;
      }
      default: {
        break;
      }
    }
  }

  static get observedAttributes() {
    return ['swipeable'];
  }
}

customElements.define('custom-drawer', Drawer);
