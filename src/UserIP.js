import { LitElement, html, css } from 'lit';
import '@lrnwebcomponents/wikipedia-query/wikipedia-query.js';

export class UserIP extends LitElement {
  static get tag() {
    return 'user-ip';
  }

  static get properties() {
    return {
      ip: { type: String, reflect: true },
      location: { type: String, reflect: true },
      city: { type: String, reflect: true },
      state: { type: String, reflect: true },
      country: { type: String, reflect: true },
    };
  }

  constructor() {
    super();
    this.ip = null;
    this.location = 'Finding Your Current Location...';
    this.city = 'Finding Your Current City...';
    this.state = 'Finding Your Current State...';
    this.country = 'Finding Your Current Country...';
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
        console.log(data);
        this.ip = data.ip;
        this.city = `${data.city}`;
        this.state = `${data.region_name}`;
        this.country = `${data.country}`;
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

  // Everything is coming up as undefined for me it worked in class but the minute i get home its undefined
  render() {
    return html`
      <p>
        IP: ${this.ip} -- Location: ${this.location} -- Country: ${this.country}
        -- City: ${this.city} -- State: ${this.state}
      </p>
      <p></p>

      <!-- List of Location Details -->
      <ul>
        <li><strong class="IP"> IP address: </strong> ${this.ip}</li>

        <li><strong class="Location"> Location: </strong> ${this.location}</li>

        <li><strong class="Country"> Country: </strong> ${this.country}</li>

        <li><strong class="City"> City: </strong> ${this.city}</li>

        <li><strong class="State"> State: </strong> ${this.state}</li>
      </ul>
    `;
  }
}

customElements.define(UserIP.tag, UserIP);
