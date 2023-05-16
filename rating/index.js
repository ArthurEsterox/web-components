const ratingTemplate = document.createElement('template');
ratingTemplate.innerHTML = `
  <style>
    * {
      box-sizing: border-box;
    }
    :host {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    :host([disabled]) {
      opacity: 0.4;
    }
    :host([disabled]),
    :host([read-only]) {
      cursor: default;
    }
    :host([disabled]) .star:hover,
    :host([read-only]) .star:hover {
      transform: scale(1);
    }

    .star {
      width: 30px;
      height: 30px;
      fill: #BDBDBD;
      transition: fill .3s ease, transform .3s ease;
    }
    .star.active {
      fill: #FAAF00;
    }
    .star:hover {
      transform: scale(1.1);
    }
  </style>
`;

const starPath = '<path d="m323 851 157-94 157 95-42-178 138-120-182-16-71-168-71 167-182 16 138 120-42 178Zm157-24L294 939q-8 5-17 4.5t-16-5.5q-7-5-10.5-13t-1.5-18l49-212-164-143q-8-7-9.5-15.5t.5-16.5q2-8 9-13.5t17-6.5l217-19 84-200q4-9 12-13.5t16-4.5q8 0 16 4.5t12 13.5l84 200 217 19q10 1 17 6.5t9 13.5q2 8 .5 16.5T826 552L662 695l49 212q2 10-1.5 18T699 938q-7 5-16 5.5t-17-4.5L480 827Zm0-206Z"/>';
const filledStarPath = '<path d="M480 827 294 939q-8 5-17 4.5t-16-5.5q-7-5-10.5-13t-1.5-18l49-212-164-143q-8-7-9.5-15.5t.5-16.5q2-8 9-13.5t17-6.5l217-19 84-200q4-9 12-13.5t16-4.5q8 0 16 4.5t12 13.5l84 200 217 19q10 1 17 6.5t9 13.5q2 8 .5 16.5T826 552L662 695l49 212q2 10-1.5 18T699 938q-7 5-16 5.5t-17-4.5L480 827Z"/>';

class Rating extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.appendChild(ratingTemplate.content.cloneNode(true));
  }

  attachHandlers() {
    this.shadowRoot.addEventListener('click', this.handleClick.bind(this));
  }

  handleClick(e) {
    if (this.hasAttribute('disabled') || this.hasAttribute('read-only')) {
      return;
    }

    let target = e.target;

    if (target.tagName !== 'svg') {
      target = target.parentElement;
    }

    const index = +target.getAttribute('data-star');

    if (typeof index !== 'number' || isNaN(index)) {
      return;
    }

    const value = +this.getAttribute('value');

    const newValue = value === index ? 0 : index;

    this.setAttribute('value', newValue);

    this.dispatchEvent(new CustomEvent('rate', { detail: newValue }));
  }

  renderStars() {
    const count = +this.getAttribute('count') || 5;
    const value = (+this.getAttribute('value') || 0) - 1;

    this.shadowRoot.querySelectorAll('svg').forEach((element) => {
      element.remove();
    });

    for (let i = 0; i < count; i++) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('star');
      svg.setAttributeNS(null, 'viewBox', '0 96 960 960');
      svg.setAttribute('data-star', i + 1);

      if (i <= value) {
        svg.innerHTML = filledStarPath;
        svg.classList.add('active');
      } else {
        svg.innerHTML = starPath;
        svg.classList.remove('active');
      }

      this.shadowRoot.appendChild(svg);
    }
  }

  connectedCallback() {
    this.attachHandlers();
    this.renderStars();
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    switch (attr) {
      case 'value':
      case 'count': {
        this.renderStars();
        break;
      }
      default: {
        break;
      }
    }
  }

  static get observedAttributes() {
    return ['value', 'count'];
  }
}

customElements.define('custom-rating', Rating);