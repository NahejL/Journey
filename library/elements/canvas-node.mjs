
import { NodeElement } from "./module.mjs"

export default class CanvasNodeElement extends NodeElement {

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

		shadow.append( CanvasNodeElement.fragment )
		shadow.adoptedStyleSheets.push( CanvasNodeElement.styleSheet )

		this.#render( shadow.getElementById( "canvas" ) )

		}

	static #fragment
	static get fragment() {
		if( CanvasNodeElement.#fragment )
			return CanvasNodeElement.#fragment.cloneNode( true )

		let template = document.createElement( "template" )
			, fragment = CanvasNodeElement.#fragment = template.content

		template.innerHTML = `
			<canvas id=canvas ></canvas>
			`
		return fragment.cloneNode( true )
		}

	static #styleSheet
	static get styleSheet() {
		if( CanvasNodeElement.#styleSheet )
			return CanvasNodeElement.#styleSheet

		let sheet = CanvasNodeElement.#styleSheet = new CSSStyleSheet

		sheet.replaceSync( `
			#canvas {
				place-self: stretch;
				width: 100%; height: 100%;
				aspect-ratio: 1;
				object-fit: contain; object-position: center;
				padding: 4px: box-sizing: border-box;
				} 
			` )

		return sheet
		}

	static {
		customElements.define( "canvas-node", this )
		}
	}
