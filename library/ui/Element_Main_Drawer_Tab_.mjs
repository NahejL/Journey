
import Multiton from "/library/Multiton.mjs"
import Scoped from "/library/Scoped.mjs"
import Frozen from "/library/Frozen.mjs"
import DebugFinalization from "/library/DebugFinalization.mjs"
import "/library/Element.mjs"
import "/library/CSSStyleDeclaration.mjs"
import Element_Main_Drawer_Shelf_ from "./Element_Main_Drawer_Shelf_.mjs"



export default class _Main_Drawer_Shelf_Tab_ {
	static {
		Multiton.define( this )
		Frozen.define( this )
		}

	#name

	get #styles() { return {
		gridRow: "1/ span 1", placeSelf: "center",
		width: "100%", height: "100%",
		display: "grid", placeContent: "center",

		} }

	#toggle( event ) {

		if( event.detail === this.#name )
			this.element.style.setProperties({
				borderBottom: "2px solid currentColor",
				cursor: "auto",
				})

		else
			this.element.style.setProperties({
				borderBottom: "2px solid transparent",
				cursor: "pointer",
				})

		}

	constructor( name ) {
		if( Multiton.has( this, name ) )
			return Multiton.get( this, name )
		Multiton.set( this, name )
		DebugFinalization.assign( this )

		this.#name = name

		let element = this.element = Element.fromTagName `main-drawer-shelf-tab`
		element.style.setProperties( this.#styles )
		element.textContent = this.#name.toUpperCase()

		element.addEventListener( "click", event => Element_Main_Drawer_Shelf_.instance.open( this.#name ) )

		if( !Scoped.isDefined( element ) )
			Scoped.define( element )
		Scoped.assign( this, element )

		Element_Main_Drawer_Shelf_.instance.element.addEventListener( "tab-change", event => this.#toggle( event ) )

		}

	}