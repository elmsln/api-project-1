import { LitElement, html, css } from 'lit';
import { UserIP } from './UserIP.js';
import '@lrnwebcomponents/wikipedia-query/wikipedia-query.js';

export class LocationFromIP extends LitElement {
  static get tag() {
    return 'location-from-ip';
  }

  constructor() {
    super();
    this.UserIpInstance = new UserIP();
    this.locationEndpoint = 'https://freegeoip.app/json/';
    this.longitude = null;
    this.latitude = null;
    this.city = null;
    this.state = null;
    this.location = 'Current Location';
  }

  static get properties() {
    return {
      longitude: { type: Number, reflects: true },
      latitude: { type: Number, reflects: true },
      state: { type: String, reflect: true },
      city: { type: String, reflect: true },
      location: { type: String, reflect: true },
    };
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.getGEOIPData();
  }

  async getGEOIPData() {
    const IPClass = new UserIP();
    const userIPData = await IPClass.updateUserIP();
    return fetch(this.locationEndpoint + userIPData.ip)
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        }
        return false;
      })
      .then(data => {
        console.log(data);
        this.latitude = data.latitude;
        this.longitude = data.longitude;
        this.state = data.region_name;
        this.city = data.city;
        this.location = `${this.city}, ${this.state}`;

        console.log(`${this.latitude} ${this.longitude}`);
        console.log(`Your Location: ${this.location}`);

        return data;
        /* this.longitude = data.longitude;

        console.log('Latitiude: ', this.latitude);
        this.latitude = data.latitude;

        console.log('Longitude: ', this.longitude);
        return data; 
        
        This didnt work so i tried again and if the new stuff doesnt work then who knows
        */
      });
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        iframe {
          height: 500px;
          width: 500px;
        }
      `,
    ];
  }

  render() {
    const url = `https://maps.google.com/maps?q=${this.latitude},${this.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    return html`
      <iframe title="Where you are" src="${url}"> </iframe>
      <ul>
        <a
          href="https://www.google.com/maps/@${this.latitude},${this
            .longitude},14z"
        >
          Show Map of ${this.city}, ${this.state}, ${this.country}
        </a>
      </ul>

      <!-- List of Wikipedia Queries -->
      <wikipedia-query search="${this.state}"></wikipedia-query>
      <wikipedia-query search="${this.city}"></wikipedia-query>
      <wikipedia-query search="${this.location}"></wikipedia-query>
    `;
  }
}

customElements.define(LocationFromIP.tag, LocationFromIP);
