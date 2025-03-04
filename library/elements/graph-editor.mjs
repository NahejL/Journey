
import { ChalkBoardElement } 
	from "./module.mjs"
import { MenuIconElement, SubMenuElement, MenuGroupElement, MenuItemElement }
	from "./module.mjs"

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
	menu-icon {
		grid-area: 1/1; place-self: start;
		position: relative; inset: 8px auto auto 8px;
		}
	::slotted(render-graph) { 
		transform: translate( var(--position-x), var(--position-y) ) scale( var(--dilation) );
		width: 0px; height: 0px;
		display: grid; grid: auto-flow 0px / 0px;
		}
	sub-menu {
		position: relative;
		min-width: 30px; min-height: 80px;
		border-radius: 8px;
		background: #FFF; color: #111;
		display: grid; grid: auto-flow min-content / min-content min-content;
		font-weight: 600;
		}
	sub-menu::before {
		content: attr(label);
		display: block;
		position: absolute; bottom: calc( 100% + 4px );
		color: #FFF;
		}
	menu-group {
		grid-column: 1/-1;
		display: grid; grid: auto-flow min-content / subgrid;
		font-weight: 600;
		}
	menu-group::before {
		grid-area: 1/1;
		padding: 4px 4px 4px 8px;
		content: attr(label);
		}
	menu-group::after {
		grid-area: 1/2;
		padding: 4px 8px 4px 4px;
		content: attr(keys);
		}
	menu-item {
		display: contents;
		font-weight: normal;
		}
	menu-item::before {
		grid-column-start: 1;
		padding: 4px 4px 4px 8px;
		content: attr(label);
		}
	menu-item::after {
		grid-column-start: 2;
		padding: 4px 8px 4px 4px;
		content: attr(keys);
		}
	`


export default class GraphEditorElement extends HTMLElement {
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
			MenuIconElement.create({},
				SubMenuElement.create({ label: "Graph" },
					MenuItemElement.create({ label: "Find", keys: "⌘F" }),
					MenuGroupElement.create({ label: "New", keys: "⌘N" },
						MenuItemElement.create({ label: "Node" }),
						MenuItemElement.create({ label: "Edge" }),
						MenuItemElement.create({ label: "View" }),
						MenuItemElement.create({ label: "Rule" }),
						),
					),
				SubMenuElement.create({ label: "Node" }),
				SubMenuElement.create({ label: "Edge" }),
				)
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