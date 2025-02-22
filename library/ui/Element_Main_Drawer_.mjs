
import Singleton from "/library/Singleton.mjs"
import Scoped from "/library/Scoped.mjs"
import Frozen from "/library/Frozen.mjs"
import DebugFinalization from "/library/DebugFinalization.mjs"
import "/library/Element.mjs"
import "/library/CSSStyleDeclaration.mjs"
import Element_Main_Drawer_Shelf_ from "./Element_Main_Drawer_Shelf_.mjs"
import Element_Main_Drawer_Backdrop_ from "./Element_Main_Drawer_Backdrop_.mjs"


export default class Element_Main_Drawer_ {
	static {
		Singleton.define( this )
		Frozen.define( this )
		}

	get #isOpen() { return localStorage.getItem( "main-drawer-is-open" ) !== null }
	set #isOpen( isOpen ) { 
		if( isOpen )
			localStorage.setItem( "main-drawer-is-open", "" ) 
		else
			localStorage.removeItem( "main-drawer-is-open" )
		}

	get #styles() { return {
		margin: "0px", padding: "0px", border: "0px", background: "none",
		position: "fixed", inset: "0px",
		width: "100%", height: "100%",
		display: this.#isOpen ? "grid" : "none", grid: "auto / auto",
		placeContent: "stretch",
		transition: "overlay .3s ease-out allow-discrete",
		} }

	constructor() {
		if( Singleton.has( this ) )
			return Singleton.get( this )
		Singleton.set( this )
		DebugFinalization.assign( this )
		
		// could be popover, should be popover, wont be popover
		let element = this.element = Element.fromOuterHTML `<main-drawer>`
		element.style.setProperties( this.#styles )
		element.append(
			Element_Main_Drawer_Backdrop_.instance.element,
			Element_Main_Drawer_Shelf_.instance.element,
			)

		if( !Scoped.isDefined( element ) )
			Scoped.define( element )
		Scoped.assign( this, element )

		}

	open() {
		this.#isOpen = true
		
		this.element.style.setProperties({
			display: "grid"
			})
		}

	close() {
		this.#isOpen = false
		
		this.element.style.setProperties({
			display: "none"
			})
		}

	}
