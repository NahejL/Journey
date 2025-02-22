
import Multiton from "/library/Multiton.mjs"
import Scoped from "/library/Scoped.mjs"
import Frozen from "/library/Frozen.mjs"
import DebugFinalization from "/library/DebugFinalization.mjs"
import "/library/Element.mjs"
import "/library/CSSStyleDeclaration.mjs"
import Element_Main_Drawer_Shelf_ from "./Element_Main_Drawer_Shelf_.mjs"


export default class Element_Main_Drawer_Shelf_TabContent_ {
	static {
		Multiton.define( this )
		Frozen.define( this )
		}

	#name

	get #styles() { return {
		gridArea: "2/1 / span 1 / span 2", placeSelf: "stretch",
		padding: "8px",
		} }

	#toggle( event ) {

		if( event.detail === this.#name )
			this.element.style.setProperties({
				display: "grid"
				})

		else
			this.element.style.setProperties({
				display: "none"
				})

		}

	constructor( name, content ) {
		if( Multiton.has( this, name ) )
			return Multiton.get( this, name )
		Multiton.set( this, name )
		DebugFinalization.assign( this )

		this.#name = name

		let element = this.element = content // Element.fromTagName `main-drawer-shelf-tab-content`
		element.style.setProperties( this.#styles )
		// this.element.append( content )

		if( !Scoped.isDefined( element ) )
			Scoped.define( element )
		Scoped.assign( this, element )

		Element_Main_Drawer_Shelf_.instance.element.addEventListener( "tab-change", event => this.#toggle( event ) )

		}

	}