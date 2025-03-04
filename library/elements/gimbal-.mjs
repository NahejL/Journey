

export default class GimbalElement extends HTMLElement {

	static get observedAttributes() { return [

		] }

	static {
		customElements.define( "gimbal-", this )
		}
	}