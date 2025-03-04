

const styles = `
	/* index === 0 */
	:host {
		display: flex; flex-flow: column nowrap;
		gap: 28px;
		}
	element- {
		width: 30px; height: 30px;
		border-radius: 8px;
		background: #FFF; color: #111;
		display: grid; place-content: center;
		font-size: 18px;
    font-family: 'Material Symbols Outlined';
		font-variation-settings:
		  'FILL' 0,
		  'wght' 400,
		  'GRAD' 0,
		  'opsz' 24;
    line-height: 1;
		cursor: pointer; pointer-events: auto;
		user-select: none; touch-action: none;
		}
	`


export default class MenuIconElement extends HTMLElement {
	#cssProperties

	constructor() {
		super()

		let shadow = this.attachShadow({
			mode: "open", slotAssignment: "named",
			delegatesFocus: true,
			})

		let [ sheet ] = shadow.adoptedStyleSheets = [ new CSSStyleSheet ]
		sheet.replaceSync( styles )
		this.#cssProperties = sheet.cssRules[0]

		let iconButton = Element.create({}, `\u{e5d2}` )
			, menuSlot = HTMLSlotElement.create({})

		shadow.append(
			iconButton,
			menuSlot,
			)

		}


	static {
		customElements.define( "menu-icon", this )
		}
	}

