
export default class GraphElement extends HTMLElement {

	constructor() {
		super()

		}

	static {
		customElements.define( "render-graph", this )
		}
	}