import { LitElement, html, css } from 'lit';

export class UserIP extends LitElement {
  static get tag() {
    return 'user-ip';
  }

  static get properties() {
    return {
      ip: { type: String, reflect: true },
      location: { type: String, reflect: true },
      city: { type: String, reflect: true },
      country: { type: String, reflect: true },
    };
  }

  constructor() {
    super();
    this.ip = null;
    this.location = '';
    this.city = '';
    this.country = '';
    this.ipLookUp = 'https://ip-fast.com/api/ip/?format=json&location=False';
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'ip' && this[propName]) {
        const evt = new CustomEvent('ip-changed', {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            value: this.ip,
          },
        });
        this.dispatchEvent(evt);
      }
    });
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    if (this.ip === null) {
      this.updateUserIP();
    }
  }

  async updateUserIP() {
    return fetch(this.ipLookUp)
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        }
        return false;
      })
      .then(data => {
        this.ip = data.ip;
        this.city = data.city;
        this.country = data.country;

        this.location = `${data.city}, ${data.country}`;
        return data;
      });
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        ul {
          margin: 0 8px;
          list-style-type: square;
          font-size: 20px;
        }

        li {
          margin: 0;
          padding: 0;
        }
        .ipaddress {
          font-style: var(--user-ip-ipaddress-font-style, italic);
        }
      `,
    ];
  }

  render() {
    return html` <ul>
      <li>
        <strong class="ipaddress">IP address: ${this.ip}</strong>
        <strong class="Country">IP address: ${this.ip}</strong>
        <strong class="City">IP address: ${this.ip}</strong>
      </li>
      <li></li>
    </ul>`;
  }
}

customElements.define(UserIP.tag, UserIP);
