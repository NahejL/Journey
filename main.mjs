
import { ContextMenuElement, ActionGroupElement, ActionItemElement,
	RenderGraphElement, RenderNodeElement, 
	ChalkBoardElement } 
	from "./library/module.mjs"


// create object properties view
// create edge rendering
// create node's ports
// create a canvas node ( ports + shader )
// create node meta data ( time, memory, ... ) 


const sheet = `
	/* index === 0 */
	:host {
		--position-x: 0;
		--position-y: 0;
		--dilation: 1;
		}
	:host {
		width: 100%; height: 100%;
		display: grid; grid: auto / auto;
		place-content: stretch;
		}
	chalk-board {
		grid-area: 1/1; place-self: stretch;
		}
	slot[name=graph] {
		grid-area: 1/1; place-self: center;
		width: 0px; height: 0px; overflow: visible;
		display: grid; grid: auto-flow 0px / 0px;
		} 
	context-menu {
		grid-area: 1/1; place-self: start;
		width: min-content; height: min-content;
		display: block;
		pointer-events: none;
		}
	::slotted(render-graph) { 
		transform: translate( var(--position-x), var(--position-y) ) scale( var(--dilation) );
		width: 0px; height: 0px;
		display: grid; grid: auto-flow 0px / 0px;
		}
	`


class GraphEditorElement extends HTMLElement {
	#cssProperties

	constructor() {
		super()

		let shadow = this.attachShadow({
			mode: "open", slotAssignment: "named",
			delegatesFocus: true,
			})

		shadow.adoptedStyleSheets = [ new CSSStyleSheet ]
		shadow.adoptedStyleSheets[0].replaceSync( sheet )
		this.#cssProperties = shadow.adoptedStyleSheets[0].cssRules[0]

		let chalkBoard = ChalkBoardElement.create({
			onTransform: event => {
				this.#cssProperties.style.setProperty( "--position-x", event.position[0] + "px" )
				this.#cssProperties.style.setProperty( "--position-y", event.position[1] + "px" )
				this.#cssProperties.style.setProperty( "--dilation", event.dilation )
				},
			})

		shadow.append( 
			chalkBoard, 
			HTMLSlotElement.create({ name: "graph" }),
			ContextMenuElement.create({ name: "Graph" },
				ActionGroupElement.create({ name: "Add", keys: "" },
					ActionItemElement.create({ name: "Node" }),
					ActionItemElement.create({ name: "Edge" }),
					ActionItemElement.create({ name: "View" }),
					ActionItemElement.create({ name: "Rule" }),
					)
				),
			ContextMenuElement.create({ name: "Node" }),
			ContextMenuElement.create({ name: "Edge" }),
			)

		}

	static create({ graph, ...attributes } = {}, ...children ) {
		graph.slot = "graph"

		let self = super.create( attributes, graph, ...children )

		return self
		}

	static {
		customElements.define( "graph-editor", this )
		}
	}


let content = GraphEditorElement.create({
	graph: RenderGraphElement.create({},
		RenderNodeElement.create({ name: "z-buffer", 
			position: [ -100, 0 ], }),
		RenderNodeElement.create({ name: "ambient",
			position: [ 0, 150 ], }),
		RenderNodeElement.create({ name: "diffused",
			position: [ 0, 0 ], }),
		RenderNodeElement.create({ name: "specular",
			position: [ 0, -150 ], }),
		RenderNodeElement.create({ name: "color",
			position: [ 100, 0 ], }),
		)
	})

document.body.append( content )
document.adoptedStyleSheets = [ new CSSStyleSheet ]
document.adoptedStyleSheets[0].replaceSync( `
	:root {
		overflow: hidden;
		font-family: sans-serif;
		letter-spacing: .6px;
		touch-action: none;
		}
	body {
		display: contents;
		}
	` )







