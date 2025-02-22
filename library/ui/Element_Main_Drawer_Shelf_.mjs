
import Singleton from "/library/Singleton.mjs"
import Scoped from "/library/Scoped.mjs"
import Frozen from "/library/Frozen.mjs"
import DebugFinalization from "/library/DebugFinalization.mjs"
import "/library/Element.mjs"
import "/library/CSSStyleDeclaration.mjs"
import Element_Main_Drawer_Tab_ from "./Element_Main_Drawer_Tab_.mjs"
import Element_Main_Drawer_TabContent_ from "./Element_Main_Drawer_TabContent_.mjs"
import Element_Main_Scene_Content_ from "./Element_Main_Scene_Content_.mjs"
import Element_Main_World_Content_ from "./Element_Main_World_Content_.mjs"



export default class Element_Main_Drawer_Shelf_ {
	static {
		Singleton.define( this )
		Frozen.define( this )
		}

	get #openTab() { return localStorage.getItem("main-drawer-open-tab") ?? "scene" }
	set #openTab( openTab ) { localStorage.setItem( "main-drawer-open-tab", openTab ) } 

	get #styles() { return {
		zIndex: "2",
		gridArea: "1/1", placeSelf: "stretch",
		width: "80%", height: "100%",
		background: "#123", color: "#FFF",
		display: "grid", grid: "minmax( 30px, min-content ) auto / auto-flow 1fr",
		placeContent: "stretch",
		background: "#111",
		} }

	constructor() {
		if( Singleton.has( this ) )
			return Singleton.get( this )
		Singleton.set( this )
		DebugFinalization.assign( this )

		let element = this.element = Element.fromTagName `main-drawer-shelf`
		element.style.setProperties( this.#styles )
		element.append(
			new Element_Main_Drawer_Tab_( "scene" ).element,
			new Element_Main_Drawer_Tab_( "world" ).element,
			new Element_Main_Drawer_TabContent_( "scene", 
				Element_Main_Scene_Content_.instance.element 
				).element,
			new Element_Main_Drawer_TabContent_( "world",
				Element_Main_World_Content_.instance.element 
				).element,
			)	

		if( !Scoped.isDefined( element ) )
			Scoped.define( element )
		Scoped.assign( this, element )

		this.open( this.#openTab )

		}

	open( tab ) {
		switch( tab ) {
		case "scene":
			this.element.dispatchEvent( new CustomEvent( "tab-change", { detail: tab } ) )
			break
		case "world":
			this.element.dispatchEvent( new CustomEvent( "tab-change", { detail: tab } ) )
			break
		default:
			throw Error.fromTemplate `tried to ${Element_Main_Drawer_Shelf_}.open with tab: ${tab}; which is not a valid option.`
			}

		this.#openTab = tab
		}

	}