// dependencies / things imported
import { LitElement, html, css } from 'lit';

// EXPORT (so make available to other documents that reference this file) a class, that extends LitElement
// which has the magic life-cycles and developer experience below added

/**
 * @todo For lab 2 see homework for week two of class
 */
export class UserIP extends LitElement {
  // a convention I enjoy so you can change the tag name in 1 place
  // change value here, applies to other places()
  static get tag() {
    return 'user-ip';
  }

  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    // default values
    this.ip = null;
    // variables can be stored on "this" as the class we're working on is like a
    // Java or other Object Oriented Programming Language
    // so for this one, we're storing a reference to the API endpoint
    // so that if it ever changed it would be easier to update
    this.ipLookUp = 'https://ip-fast.com/api/ip/?format=json&location=False';
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      ip: { type: String, reflect: true },
    };
  }

  // updated fires every time a property defined above changes
  // this allows you to react to variables changing and use javascript to perform logic
  updated(changedProperties) {
    // this is looping over an array of values that's keyed by property name == the old value
    // this is because you could always write this.whatever if "whatever" is the property name in question
    changedProperties.forEach((oldValue, propName) => {
      // see if the current property that we know changed, is called ip
      // also see if it has ANY value. We benefit from JS being lazy typed here because null
      // (our default value) will fail this test but ANY VALUE will pass it
      if (propName === 'ip' && this[propName]) {
        // JS is driven heavily by user events like click, hover, focus, keydown, etc
        // but you can also generate any custom event you want at any time of any name!
        // in this case, when the value of ip changes, I'm going to emit a "ip-changed" event
        // this way of other parts of the application want to know that ip changed in this element
        // then it can react to it accordingly
        const evt = new CustomEvent('ip-changed', {
          // send the event up in the HTML document
          bubbles: true,
          // move up out of custom tags (that have a shadowRoot) and regular HTML tags
          composed: true,
          // other developers / code is allowed to tell this event to STOP going up in the DOM
          cancelable: true,
          // the payload of data to fire internal to the document
          // this structure can be whatever you want in detail, a lot of times
          // I either make detail : this
          // or detail.value = whatever the important value is to send
          detail: {
            value: this.ip,
          },
        });
        // this actually fires the event up from this tag in the page based on criteria above
        this.dispatchEvent(evt);
      }
    });
  }

  // Lit life-cycle; this fires the 1st time the element is rendered on the screen
  // this is a sign it is safe to make calls to this.shadowRoot
  firstUpdated(changedProperties) {
    // "super" is a reserved word so that objects made before us can run THEIR version of this method
    // for example, if LitElement had a firstUpdated on it's class, we are extending from LitElement
    // at the top of this class so it's important we run LitElement's code... THEN ours here
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // go get an IP address based on the user generating a request
    // to this cool, simple, anonymous IP returning service
    // sanity check that this wasn't set previously
    if (this.ip === null) {
      this.updateUserIP();
    }
  }

  /**
   * Async, so run this code in order though in this example
   * it'll run regardless since we're not doing other actions
   */
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
        return data;
      });
  }

  // styles that ONLY APPLY TO THIS CODE BLOCK
  // this capability is called ShadowRoot and
  // it ensures that the code in the render() method
  // will be the only thing to get these styles applied
  // certain things can go in but the styles can't bleed out
  static get styles() {
    return [
      css`
        /* :host is a special selector meaning the styles to apply to the tag itself, like defaults */
        :host {
          display: block;
        }
        /* an unordered list is a ul tag */
        ul {
          margin: 0 8px;
          list-style-type: square;
          font-size: 20px;
        }
        /* a list item in an ul or ol */
        li {
          margin: 0;
          padding: 0;
        }
        .ipaddress {
          /* This is a CSS variable meaning code external to this can style using this variable in CSS */
          font-style: var(--user-ip-ipaddress-font-style, italic);
        }
      `,
    ];
  }

  // this serves very little purpose but at least we're rendering the info
  render() {
    return html` <ul>
      <li><strong class="ipaddress">IP address:</strong> ${this.ip}</li>
      <li></li>
    </ul>`;
  }
}

customElements.define(UserIP.tag, UserIP);
