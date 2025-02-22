
import Singleton from "/library/Singleton.mjs"
import Scoped from "/library/Scoped.mjs"
import Frozen from "/library/Frozen.mjs"
import DebugFinalization from "/library/DebugFinalization.mjs"
import "/library/Element.mjs"
import "/library/CSSStyleDeclaration.mjs"
import Element_Main_Drawer_ from "./Element_Main_Drawer_.mjs"



export default class Element_Main_Drawer_Backdrop_ {
	static {
		Singleton.define( this )
		Frozen.define( this )
		}

	get #styles() { return {
		zIndex: "1",
		gridArea: "1/1", placeSelf: "stretch",
		width: "100%", height: "100%",
		backdropFilter: "blur(2px)",
		cursor: "pointer",
		} }

	#toggle() {
		Element_Main_Drawer_.instance.close() 
		}

	constructor() {
		if( Singleton.has( this ) ) 
			return Singleton.get( this )
		Singleton.set( this )
		DebugFinalization.assign( this )

		let element = this.element = Element.fromTagName `main-drawer-backdrop`
		element.style.setProperties( this.#styles )
		element.addEventListener( "click", event => this.#toggle() )

		if( !Scoped.isDefined( element ) )
			Scoped.define( element )
		Scoped.assign( this, element )

		}

	}
