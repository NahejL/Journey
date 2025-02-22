
import Singleton from "/library/Singleton.mjs"
import Scoped from "/library/Scoped.mjs"
import Frozen from "/library/Frozen.mjs"
import DebugFinalization from "/library/DebugFinalization.mjs"
import "/library/Element.mjs"
import "/library/CSSStyleDeclaration.mjs"
import Element_Main_Drawer_ from "./Element_Main_Drawer_.mjs"
import Element_Main_Drawer_Toggle_ from "./Element_Main_Drawer_Toggle_.mjs"


export default class Element_Main_Frame_ {
	static {
		Singleton.define( this )
		Frozen.define( this )
		}

	get #styles() { return {
		width: "100%", height: "100%",
		display: "grid", grid: "auto / auto",
		placeContent: "stretch",
		XPx: "0px", YPx: "0px",
		R: "1px",
		background: [
			`calc( var(--x-px) + 10px ) calc( var(--y-px) + 10px ) / 20px 20px radial-gradient( #000 var(--r), #0000 var(--r) )`,
			`calc( var(--x-px) + 20px ) calc( var(--y-px) + 20px ) / 20px 20px radial-gradient( #000 var(--r), #0000 var(--r) )` ],
		} }

	constructor() {
		if( Singleton.has( this ) )
			return Singleton.get( this )
		Singleton.set( this )
		DebugFinalization.assign( this )

		let element = this.element = Element.fromTagName `main-frame`
		element.style.setProperties( this.#styles )
		element.append(
			Element_Main_Drawer_.instance.element,
			Element_Main_Drawer_Toggle_.instance.element,
			)

		if( !Scoped.isDefined( element ) )
			Scoped.define( element )
		Scoped.assign( this, element )

		}

	}


