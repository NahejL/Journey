

export default class ContextMenuElement extends HTMLElement {

	connectedCallback() {
		if( !this.isConnected )
			return

		}

	disconnectedCallback() {
		if( this.isConnected )
			return

		}

	attributeChangedCallback( name, prev, curr ) {
		if( prev === curr )
			return
		switch( name ) {

			}
		}

	constructor() {
		super()

		}

	static get observedAttributes() { return [ "mode" ] }

	static {
		customElements.define( "context-menu", this )
		}
	}