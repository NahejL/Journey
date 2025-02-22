
import Singleton from "/library/Singleton.mjs"
import Scoped from "/library/Scoped.mjs"
import Frozen from "/library/Frozen.mjs"
import DebugFinalization from "/library/DebugFinalization.mjs"
import "/library/Element.mjs"
import "/library/CSSStyleDeclaration.mjs"



export default class Element_Main_World_Content_ {
	static {
		Singleton.define( this )
		Frozen.define( this )
		
		}

	constructor() {
		if( Singleton.has( this ) )
			return Singleton.get( this )
		Singleton.set( this )
		DebugFinalization.assign( this )

		let element = this.element = Element.fromTagName `main-world-content`
		element.textContent = "world"

		if( !Scoped.isDefined( element ) )
			Scoped.define( element )
		Scoped.assign( this, element )

		}

	}