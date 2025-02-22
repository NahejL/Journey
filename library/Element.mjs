
import Extension from "./Extension.mjs"
import Frozen from "./Frozen.mjs"
import "./String.mjs"

class Element_Extension {
	static {
		Extension.define( this, Element )
		Frozen.define( this )
		}

	static #template = document.createElement("template")

	static fromOuterHTML( strings, ...values ) {
		let string = String.fromTemplate( strings, ...values )
			, template = Element_Extension.#template
		
		template.innerHTML = string
		try { return template.content.firstElementChild }
	 	
		finally {
			Element_Extension.#template.replaceChildren()
			}
		}

	static fromTagName( strings, ...values ) {
		return document.createElement( String.fromTemplate( strings, ...values ) )
		}

	}