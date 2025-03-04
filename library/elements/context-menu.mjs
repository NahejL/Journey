
const styles = ``


export default class ContextMenuElement extends HTMLElement {
	#cssProperties

	attributeChangedCallback( name, prev, curr ) {
		if( prev === curr )
			return
		switch( name ) {

			}
		}

	constructor() {
		super()

		let shadow = this.attachShadow({ 
			mode: "open", slotAssignment: "named",
			delegatesFocus: true,
			})

		let [ sheet ] = shadow.adoptedStyleSheets = [ new CSSStyleSheet ]
		sheet.replaceSync( styles )
		this.#cssProperties = sheet.cssRules[0]

		}

	static get observedAttributes() { return [ "position" ] }

	static {
		customElements.define( "context-menu", this )
		}
	}