
import Extension from "./Extension.mjs"


class ElementExtension {
	static {
		Extension.apply( this, Element )
		}

	static get tagName() { return customElements.getName( this ) ?? "element-" }

	static create( attributes, ...children ) {
		attributes ??= {}
		
		let element = document.createElement( this.tagName )

		for( let [ name, value ] of Object.entries( attributes ) )
			element.setAttribute( name, value )
		
		element.append( ...children )
		
		return element
		}

	}


class SlotElementExtension {
	static {
		Extension.apply( this, HTMLSlotElement )
		}

	static get tagName() { return "slot" }

	}