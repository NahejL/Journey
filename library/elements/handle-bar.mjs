

export default class HandleBarElement extends HTMLElement {

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
			if( event.button !== 0 )
				return
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