
const sheet = `
	/* index === 0 */
	:host {
		--position-x: 0;
		--position-y: 0;
		--rotation: 0;
		--dilation: 1;
		}

	:host {
		--offset: calc( 10px * var(--dilation, 1 ) );
		background-position: 
			calc( 50% + var(--position-x) ) calc( 50% + var(--position-y) ), 
			calc( 50% + var(--position-x) + var(--offset) ) calc( 50% + var(--position-y) + var(--offset) ) ;
		--size: calc( 20px * var(--dilation, 1 ) );
		background-size: var(--size) var(--size), var(--size) var(--size);
		background-image:
			radial-gradient( circle at center, #000 1px, #0000 1px ),
			radial-gradient( circle at center, #000 1px, #0000 1px );
		cursor: grab; 
		pointer-events: auto;
		user-select: none;
		touch-action: none;
		}

	:host(.grabbing) {
		cursor: grabbing;
		}

	`



export default class ChalkBoardElement extends HTMLElement {
	#cssProperties
	#position = [ 0, 0 ]
	#rotation = 0
	#dilation = 1

	#move( mx, my ) {
		let transform = new DOMMatrix()
			.translateSelf( mx, my )
			.scaleSelf( 1 / this.#dilation, 1 / this.#dilation )
		this.#position[0] += transform.e
		this.#position[1] += transform.f
		this.#updateProperties()
		}

	#rotate( ra, ox, oy ) {

		}

	#scale( ss, ox, oy ) {
		let next = Math.min( Math.max( 0.5, this.#dilation + ss / 200 ), 5 )
			, ratio = next / this.#dilation

		if( ratio === 1 )
			return

		let transform = new DOMMatrix()
			.scaleSelf( ratio, ratio, 1, ox, oy, 0 )
			.translateSelf( ...this.#position )
		
		this.#position[0] = transform.e
		this.#position[1] = transform.f
		this.#dilation = next
		this.#updateProperties()
		}

	#updateProperties() {
		// sheet - > rule
		this.#cssProperties.style.setProperty( "--position-x", this.#position[0] + "px" )
		this.#cssProperties.style.setProperty( "--position-y", this.#position[1] + "px" )
		this.#cssProperties.style.setProperty( "--rotation", this.#rotation + "rad" )
		this.#cssProperties.style.setProperty( "--dilation", this.#dilation )

		this.dispatchEvent( new ChalkBoardElement.TransformEvent( this ) )

		}

	constructor() {
		super()

		this.addEventListener( "pointerdown", 				ChalkBoardElement.#onPointerDown )
		this.addEventListener( "pointermove", 				ChalkBoardElement.#onPointerMove )
		this.addEventListener( "gotpointercapture", 	ChalkBoardElement.#onGotPointerCapture )
		this.addEventListener( "lostpointercapture", 	ChalkBoardElement.#onLostPointerCapture )
		this.addEventListener( "wheel", 							ChalkBoardElement.#onWheel )

		let shadow = this.attachShadow({
			mode: "open", slotAssignement: "named",
			delegatesFocus: true
			})

		shadow.adoptedStyleSheets = [ new CSSStyleSheet ]
		shadow.adoptedStyleSheets[0].replaceSync( sheet )
		this.#cssProperties = shadow.adoptedStyleSheets[0].cssRules[0]
		this.#updateProperties()

		}

	static #onPointerDown( event ) {
		if( event.currentTarget instanceof ChalkBoardElement )
		switch( event.button ) {
		case 0:
		case 1:
			event.currentTarget.setPointerCapture( event.pointerId )
			break
			}
		}	

	static #onPointerMove( event ) {
		if( event.currentTarget instanceof ChalkBoardElement )
		if( event.currentTarget.hasPointerCapture( event.pointerId ) )
		event.currentTarget.#move( event.movementX, event.movementY )
		}

	static #onGotPointerCapture( event ) {
		if( event.currentTarget instanceof ChalkBoardElement )
		event.currentTarget.classList.add( "grabbing" )
		}

	static #onLostPointerCapture( event ) {
		if( event.currentTarget instanceof ChalkBoardElement )
		event.currentTarget.classList.remove( "grabbing" )
		}

	static #onWheel( event ) {
		if( !( event.currentTarget instanceof ChalkBoardElement ) )
			return

		let rect = event.currentTarget.getBoundingClientRect()
			, x = event.clientX - rect.left - rect.width / 2
			, y = event.clientY - rect.top - rect.height / 2

		if( event.deltaX )
			event.currentTarget.#rotate( event.deltaX, x, y )

		if( event.deltaY )
			event.currentTarget.#scale( event.deltaY, x, y )
		
		}

	static TransformEvent = class extends CustomEvent {
		constructor( chalkBoard ) {
			super( "chalk-board-transform" )
			this.position = [ ...chalkBoard.#position ]
			this.rotation = chalkBoard.#rotation
			this.dilation = chalkBoard.#dilation
			}
		}

	static create({ onTransform, ...attributes } = {}, ...children ) {
		let self = super.create( attributes, ...children )

		if( onTransform )
			self.addEventListener( "chalk-board-transform", onTransform )

		return self
		}

	static {
		customElements.define( "chalk-board", this )
		}
	}
