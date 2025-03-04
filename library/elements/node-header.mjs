


export default class NodeHeaderElement extends HTMLElement {

	constructor() {
		super()

		}

	static create({ ...attributes } = {}, ...children ) {
		return super.create( attributes, children )
		}

	static {
		customElements.define( "node-header", this )
		}
	}