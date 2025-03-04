

import NodeElement from "./node-.mjs"


export default class RenderNode extends NodeElement {


	static {
		customElements.define( "render-node", this )
		}
	}