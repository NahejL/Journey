
import Singleton from "/library/Singleton.mjs"
import Scoped from "/library/Scoped.mjs"
import Frozen from "/library/Frozen.mjs"
import DebugFinalization from "/library/DebugFinalization.mjs"
import "/library/Element.mjs"
import "/library/CSSStyleDeclaration.mjs"
import Element_WorldArray_ from "./Element_WorldArray_.mjs"



export default class Element_Main_World_Content_ {
	static {
		Singleton.define( this )
		Frozen.define( this )
		}

	get #styles() { return {
		display: "grid", grid: "auto-flow minmax( 30px, min-content ) / auto minmax( 30px, min-content )",
		background: `radial-gradient( circle at 80% 80%, #FFF3 0%, #FFF0 80% )`,
		} }

	constructor() {
		if( Singleton.has( this ) )
			return Singleton.get( this )
		Singleton.set( this )
		DebugFinalization.assign( this )

		let element = this.element = Element.fromTagName `main-world-content`
		element.style.setProperties( this.#styles )

		element.append(
			Element_WorldArray_.getInstance(0).element,
			Element_WorldArray_.getInstance(1).element,
			)

		if( !Scoped.isDefined( element ) )
			Scoped.define( element )
		Scoped.assign( this, element )

		}

	}