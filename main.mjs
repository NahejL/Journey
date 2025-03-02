

// create context menus
// create edge rendering
// create node's ports
// create a canvas node ( ports + shader )
// create node meta data ( time, memory, ... ) 


document.documentElement.style.overflow = "hidden"
document.documentElement.style.fontFamily = "sans-serif"
document.documentElement.style.letterSpacing = ".6px"


let shadow = document.body.attachShadow({
	mode: "open", slotAssignment: "named",
	delegatesFocus: true,
	})

shadow.innerHTML = `<style>
		:host {
			display: contents;			
			}
		</style>
	<graph->
		<node- name=z-buffer 	position-x=-100 position-y=0 		></node->
		<node- name=ambiant 	position-x=0 		position-y=150 	></node->
		<node- name=diffused 	position-x=0  	position-y=0 		></node->
		<node- name=specular 	position-x=0 		position-y=-150	></node->
		<canvas-node name=color position-x=100 	position-y=0 	></canvas-node>
		</graph->`


class NodeElement extends HTMLElement {
	#position = [ 0, 0 ]

	#handleSteeringHandler( event ) {
		let graph = this.closest( "graph-" )
			, scale = graph?.scale

		if( !graph ) 
			return

		let x = this.#position[0] += event.dx / scale 
			, y = this.#position[1] += event.dy / scale 

		this.style.setProperty( "--offset-x", x + "px" )
		this.style.setProperty( "--offset-y", y + "px" )
		this.setAttribute( "position-x", x )
		this.setAttribute( "position-y", y )
		}

	attributeChangedCallback( name, prev, curr ) {
		if( curr === prev )
			return
		switch( name ) {
		case "name":
			this.style.setProperty( "--name", "\"" + curr + "\"" )
			break
		case "position-x":
			let x = Number( curr )
			if( Number.isNaN( x ) ) x = 0
			this.#position[0] = x
			this.style.setProperty( "--offset-x", x + "px" )
			break
		case "position-y":
			let y = Number( curr )
			if( Number.isNaN( y ) ) y = 0
			this.#position[1] = y
			this.style.setProperty( "--offset-y", y + "px" )
			break
			}
		}

	constructor() {
		super()
	
		let shadow = this.attachShadow({
			mode: "open", slotAssignment: "named",
			delegatesFocus: true
			})

		shadow.innerHTML = `<style>
				:host {
					--name: "unamed";
					--offset-x: 0px; --offset-y: 0px;
					transform: translate( var(--offset-x), var(--offset-y) );
					display: grid; grid: auto-flow min-content / auto;
					min-width: 80px; min-height: 120px;
					box-shadow: 0px 1px 2px -1px #000;
					border-radius: 6px;
					overflow: hidden;
					background: #FFF;
					pointer-events: auto;
					transition: box-shadow .3s ease-out;
					}
				:host(.grabbing) {
					box-shadow: 0px 1px 2px 0px #000;
					}
				#handle {
					place-self: stretch;
					height: min-content;
					padding: 4px;
					display: grid; place-content: center;
					background: orange; color: white;
					}
				slot[name=name]::before {
					content: var(--name);
					}
				</style>
			<handle-bar id=handle ><slot name=name ></slot></handle-bar>
			<slot></slot>`

		let handleBar = shadow.getElementById( "handle" )

		handleBar.addEventListener( "handle-bar-grab", event => this.classList.add( "grabbing" ) )
		handleBar.addEventListener( "handle-bar-steer", event => this.#handleSteeringHandler( event ) )
		handleBar.addEventListener( "handle-bar-release", event => this.classList.remove( "grabbing" ) )

		}

	static SteeringEvent = class extends CustomEvent {
		constructor( node ) {
			super( "node-steering" )
			this.matrix = new DOMMatrixReadOnly()
				.translate( ...node.#position )
			}
		}

	static get observedAttributes() { return [ "name", "position-x", "position-y" ] }

	static {
		customElements.define( "node-", this )
		}
	}


class CanvasNodeElement extends NodeElement {

	async #render( canvas ) {

		let context = canvas.getContext("webgpu")
			, format = navigator.gpu.getPreferredCanvasFormat()
			, adapter = await navigator.gpu.requestAdapter()
			, device = await adapter.requestDevice()
			
		context.configure({ format, device })

		let encoder = device.createCommandEncoder()
			, pass = encoder.beginRenderPass({
				colorAttachments: [{ 
					view: context.getCurrentTexture().createView(),
					loadOp: "clear",
					storeOp: "store"
					}]
				})

		device.queue.submit([ encoder.finish() ])

		}

	attributeChangedCallback( name, curr, prev ) {
		super.attributeChangedCallback( name, curr, prev )
		}

	constructor() {
		super()

		let shadow = this.shadowRoot

		shadow.append( CanvasNodeElement.#content )

		let canvas = shadow.getElementById( "canvas" )

		this.#render( canvas )

		}

	static #template
	static get #content() {
		if( !this.#template ) {
			this.#template = document.createElement("template")
			this.#template.innerHTML = `<style>
					#canvas {
						place-self: stretch;
						width: 100%; height: 100%;
						aspect-ratio: 1;
						object-fit: contain; object-position: center;
						padding: 4px: box-sizing: border-box;
						}
					</style>
				<canvas id=canvas ></canvas>`
			}
		return this.#template.content.cloneNode( true )
		}

	static {
		customElements.define( "canvas-node", this )
		}
	}


class GraphElement extends HTMLElement {
	#scale = 1

	get scale() {
		return this.#scale
		}

	#boardSteeringHandler( event ) {
		this.style.setProperty( "--offset-x", event.position[0] + "px" )
		this.style.setProperty( "--offset-y", event.position[1] + "px" )
		this.style.setProperty( "--scale", event.dilation )
		this.#scale = event.dilation			
		}

	constructor() {
		super()

		let shadow = this.attachShadow({
			mode: "open", slotAssignment: "named",
			delegatesFocus: true,
			})

		shadow.innerHTML = `<style>
			:host {
				width: 100%; height: 100%;
				display: grid; grid: auto / auto;
				place-content: stretch;
				}
			#board {
				grid-area: 1/1;
				}
			#contents {
				transform: translate( var(--offset-x), var(--offset-y) ) scale( var(--scale) );
				grid-area: 1/1;
				width: 100%; height: 100%;
				display: grid; grid: auto-flow 0px / 0px;
				place-content: center; place-items: start;
				pointer-events: none;
				}
				</style>
			<handle-board id=board ></handle-board>
			<slot id=contents ></slot>`

		let board = shadow.getElementById( "board" )

		board.addEventListener( "board-steering", event => this.#boardSteeringHandler( event ) )

		}

	static {
		customElements.define( "graph-", this )
		}
	}


class HandleBoardElement extends HTMLElement {
	#position = [ 0, 0 ]
	#dilation = 1
	#rotation = 0

	#boardSteeringHandler( event ) {
		let transform = new DOMMatrix()
			.translateSelf( event.position[0], event.position[1] )
			.rotateSelf( event.rotation )
			.scaleSelf( event.dilation, event.dilation, 1, 0, 0, 0 )

		let point = [ transform.e, transform.f ]
			, size = 20 * event.dilation

		this.style.setProperty( "--offset-x", point[0] )
		this.style.setProperty( "--offset-y", point[1] )
		this.style.setProperty( "--size", size )
		}

	#pointerMoveHandler( event ) {
		if( !this.hasPointerCapture( event.pointerId ) ) 
			return

		let point = new DOMMatrix()
			.translateSelf( event.movementX, event.movementY )
			.rotateSelf( -this.#rotation )
			.scaleSelf( 1 / this.#dilation )
	
		this.#position[0] += point.e
		this.#position[1] += point.f
		this.dispatchEvent( new HandleBoardElement.SteeringEvent( this ) )
		}

	#wheelHandler( event ) {
		event.preventDefault()

		switch( event.deltaX ) {
		case 0:
			break
		default:
			break
			}

		switch( event.deltaY ) {
		case 0:
			break
		default:
			let next_dilation = this.#dilation + event.deltaY / 200 
		
			if( next_dilation > 3 || next_dilation < .3 )
				break

			let rect = this.getBoundingClientRect()
				, pivot = [ event.clientX - rect.left - rect.width / 2, event.clientY - rect.top - rect.height / 2 ]
				, ratio = next_dilation / this.#dilation
				, point = new DOMMatrix()
					.scaleSelf( ratio, ratio, 1, pivot[0], pivot[1], 0 )
					.translateSelf( ...this.#position )

			this.#position[0] = point.e
			this.#position[1] = point.f
			this.#dilation = next_dilation
			}

		this.dispatchEvent( new HandleBoardElement.SteeringEvent( this ) )
		}

	constructor() {
		super()

		let shadow = this.attachShadow({
			mode: "open", slotAssignment: "named",
			delegatesFocus: true
			})

		shadow.innerHTML = `<style>
				:host {
					width: 100%; height: 100%;
					display: grid; 
					background-position: calc( 50% + var(--offset-x) * 1px ) calc( 50% + var(--offset-y) * 1px );
					background-size: calc( var(--size) * 1px ) calc( var(--size) * 1px );
					background-image: radial-gradient( #000 1px, #0000 1px );
					cursor: grab;
					user-select: none;
					}
				:host(.grabbing) {
					cursor: grabbing;
					}
				</style>
			<gimbal- id=gimbal ></gimbal->`

		this.addEventListener( "board-steering", event => this.#boardSteeringHandler( event ) )	
		this.addEventListener( "pointerdown", event => this.setPointerCapture( event.pointerId ) )
		this.addEventListener( "gotpointercapture", event => this.classList.add( "grabbing" ) )
		this.addEventListener( "pointermove", event => this.#pointerMoveHandler( event ) )
		this.addEventListener( "lostpointercapture", event => this.classList.remove( "grabbing" ) )
		this.addEventListener( "wheel", event => this.#wheelHandler( event ) )
		
		let gimbal = shadow.getElementById("gimbal")

		this.addEventListener( "board-steering", ({}) => {
			gimbal.origin = [ 0, 0 ]
			gimbal.scale = 1
			gimbal.rotation = 0
			} )

		this.dispatchEvent( new HandleBoardElement.SteeringEvent( this ) )

		}

	static SteeringEvent = class extends CustomEvent {
		constructor( board ) {
			super( "board-steering" )
			this.position = [ ...board.#position ]
			this.dilation = board.#dilation
			this.rotation = board.#rotation
			}
		}

	static {
		customElements.define( "handle-board", this )
		}
	}


class HandleBarElement extends HTMLElement {

	constructor() {
		super()

		let shadow = this.attachShadow({
			mode: "open", slotAssignment: "named",
			delegatesFocus: true,
			})

		shadow.innerHTML = `<style>
				:host {
					cursor: grab;
					user-select: none;
					}
				:host(.grabbing) {
					cursor: grabbing;
					}
				</style>
			<slot></slot>`

		this.addEventListener( "pointerdown", event => {
			this.setPointerCapture( event.pointerId )
			} )

		this.addEventListener( "gotpointercapture", event => {
			this.classList.add("grabbing")
			this.dispatchEvent( new HandleBarElement.GrabEvent )
			} )

		this.addEventListener( "pointermove", event => {
			if( !this.hasPointerCapture( event.pointerId ) ) return
			this.dispatchEvent( new HandleBarElement.SteerEvent( event.movementX, event.movementY ) )
			} )

		this.addEventListener( "lostpointercapture", event => {
			this.classList.remove("grabbing")
			this.dispatchEvent( new HandleBarElement.ReleaseEvent )
			} )

		}


	static SteerEvent = class extends CustomEvent {
		constructor( dx, dy ) {
			super( "handle-bar-steer" )
			this.dx = dx
			this.dy = dy
			}
		}

	static ReleaseEvent = class extends CustomEvent {
		constructor() {
			super( "handle-bar-release" )
			}
		}

	static GrabEvent = class extends CustomEvent {
		constructor() {
			super( "handle-bar-grab" )
			}
		}

	static {
		customElements.define( "handle-bar", this )
		}
	}


class GimbalElement extends HTMLElement {

	static get observedAttributes() { return [

		] }

	static {
		customElements.define( "gimbal-", this )
		}
	}