const loaderTemplate = document.createElement('template');
loaderTemplate.innerHTML = `
  <style>
    * {
      box-sizing: border-box;
    }
    :host {
      width: 40px;
      height: 40px;
      display: inline-block;
      color: #1976d2;
      animation: rotate 1.4s linear infinite;
    }
    .loader {
      display: block;
      color: currentColor;
    }
    .loader-circle {
      stroke: currentColor;
      stroke-dasharray: 80px,200px;
      stroke-dashoffset: 0;
      animation: rotate-circle 1.4s ease-in-out infinite;
    }

    @keyframes rotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes rotate-circle {
      0% {
        stroke-dasharray: 1px,200px;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 100px,200px;
        stroke-dashoffset: -15px;
      }
      100% {
        stroke-dasharray: 100px,200px;
        stroke-dashoffset: -125px;
      }
    }
  </style>

  <svg class="loader" viewBox="22 22 44 44">
    <circle class="loader-circle" cx="44" cy="44" r="20.2" fill="none" stroke-width="3.6"></circle>
  </svg>
`;

class Loader extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.appendChild(loaderTemplate.content.cloneNode(true));
  }

  renderColor(color) {
    this.style.color = color || '#1976d2';
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    switch (attr) {
      case 'color': {
        this.renderColor(newValue);
        break;
      }
      default: {
        break;
      }
    }
  }

  static get observedAttributes() {
    return ['color'];
  }
}

customElements.define('custom-loader', Loader);
