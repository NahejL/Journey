
import Singleton from "/library/Singleton.mjs"
import Scoped from "/library/Scoped.mjs"
import Frozen from "/library/Frozen.mjs"
import DebugFinalization from "/library/DebugFinalization.mjs"
import "/library/Element.mjs"
import "/library/CSSStyleDeclaration.mjs"
import Element_Main_Drawer_ from "./Element_Main_Drawer_.mjs"


export default class Element_Main_Drawer_Toggle_ {
	static {
		Singleton.define( this )
		Frozen.define( this )
		}

	get #styles() { return {
		gridArea: "1/1 / -1/-1", placeSelf: "start",
		margin: "8px auto auto 8px",
		width: "30px", height: "30px",
		borderRadius: "6px",
		background: "center / 18px 18px no-repeat url(./library/icons/menu.svg) #EEE",
		cursor: "pointer",
		transition: "box-shadow .3s ease-out",
		} }

	#highlight() {
		this.element.style.setProperties({
			boxShadow: "0px 1px 2px -1px #000",
			})
		}

	#lowdark() {
		this.element.style.setProperties({
			boxShadow: undefined,
			})
		}

	#toggle() {
		Element_Main_Drawer_.instance.open()
		}

	constructor() {
		if( Singleton.has( this ) )
			return Singleton.get( this )
		Singleton.set( this )
		DebugFinalization.assign( this )

		let element = this.element = Element.fromOuterHTML `<main-drawer-toggle tabIndex=0 >`
		element.style.setProperties( this.#styles )
		element.addEventListener( "focus", event => this.#highlight() )
		element.addEventListener( "pointerenter", event => this.#highlight() )
		element.addEventListener( "blur", event => this.#lowdark() )
		element.addEventListener( "pointerleave", event => this.#lowdark() )	
		element.addEventListener( "click", event => this.#toggle() )

		if( !Scoped.isDefined( element ) )
			Scoped.define( element )
		Scoped.assign( this, element )
		
		}

	}
