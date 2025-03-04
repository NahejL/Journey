
import NodeHeaderElement from "./node-header.mjs"


const sheet = `
	/* index === 0 */
	:host {
		--position-x: 0;
		--position-y: 0;
		transform: translate( var(--position-x), var(--position-y) );
		overflow: hidden;
		min-width: 80px; min-height: 120px;
		box-shadow: 0px 1px 2px -1px #000;
		border-radius: 6px;
		background: #FFF;
		transition: box-shadow .3s ease-out;
		--name: attr(name);
		}
	:host:has(node-header.grabbing) {
		box-shadow: 1px 2px 4px -1px #000;
		}
	node-header {
		width: 100%; min-height: 30px;
		display: grid; place-content: center;
		background: orange; color: #FFF;
		font-weight: 600;
		cursor: grab; pointer-events: auto;
		user-select: none; touch-action: none;
		}
	node-header.grabbing {
		cursor: grabbing;
		}
	node-header::before {
		content: var(--name);
		}
	`


export default class NodeElement extends HTMLElement {
	#cssProperties
	#name = "unamed"
	#position = [ 0, 0 ]

	#move( mx, my ) {
		this.#position[0] += mx
		this.#position[1] += my
		this.#updateProperties()
		}

	#updateProperties() {

		this.#cssProperties.style.setProperty( "--position-x", this.#position[0] + "px" )
		this.#cssProperties.style.setProperty( "--position-y", this.#position[1] + "px" )

		}

	attributeChangedCallback( name, prev, curr ) {
		if( curr === prev )
			return
		switch( name ) {
		case "name":
			this.#name = curr ?? "unamed"
			break
		case "position":
			let position = curr.split(",").map( each => Number( each ) )
			if( Number.isNaN( position[0] ) || Number.isNaN( position[1] ) ) {
				this.setAttribute( "position", this.#position )
				break
				}
			this.#position = position
			break
			}
		this.#updateProperties()
		}

	constructor() {
		super()

		this.append(
			// ports
			)
	
		let shadow = this.attachShadow({
			mode: "open", slotAssignement: "named",
			delegatesFocus: true
			})

		let header = NodeHeaderElement.create()

		header.targetNode = this
		header.addEventListener( "pointerdown", NodeElement.#onHeaderPointerDown )
		header.addEventListener( "pointermove", NodeElement.#onHeaderPointerMove )
		header.addEventListener( "gotpointercapture", NodeElement.#onHeaderGotPointerCapture )
		header.addEventListener( "lostpointercapture", NodeElement.#onHeaderLostPointerCapture )

		shadow.append(
			header,
			)

		shadow.adoptedStyleSheets = [ new CSSStyleSheet ]
		shadow.adoptedStyleSheets[0].replaceSync( sheet )
		this.#cssProperties = shadow.adoptedStyleSheets[0].cssRules[0]
		this.#updateProperties()

		}

	static #onHeaderPointerDown( event ) {
		if( event.currentTarget instanceof NodeHeaderElement )
		switch( event.button ) {
		case 0:
		case 1:
			event.currentTarget.setPointerCapture( event.pointerId )
			break
			}
		}

	static #onHeaderPointerMove( event ) {
		if( event.currentTarget instanceof NodeHeaderElement )
		if( event.currentTarget.hasPointerCapture( event.pointerId ) ) 
			event.currentTarget.targetNode.#move( event.movementX, event.movementY )
		}

	static #onHeaderGotPointerCapture( event ) {
		if( event.currentTarget instanceof NodeHeaderElement )
		event.currentTarget.classList.add( "grabbing" )
		}

	static #onHeaderLostPointerCapture( event ) {
		if( event.currentTarget instanceof NodeHeaderElement )
		event.currentTarget.classList.remove( "grabbing" )
		}

	static get observedAttributes() { return [ "name", "position" ] }

	static {
		customElements.define( "node-", this )
		}
	}

