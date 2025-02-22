
import Singleton from "/library/Singleton.mjs"
import Scoped from "/library/Scoped.mjs"
import Frozen from "/library/Frozen.mjs"
import DebugFinalization from "/library/DebugFinalization.mjs"
import "/library/Element.mjs"
import "/library/CSSStyleDeclaration.mjs"
import Element_SceneObject_ from "./Element_SceneObject_.mjs"



export default class Element_Main_Scene_Content_ {
	static {
		Singleton.define( this )
		Frozen.define( this )
		}

	get #styles() { return {
		display: "grid", grid: "auto-flow minmax( min-content, 30px ) / auto minmax( min-content, 30px )",
		background: `radial-gradient( circle at 80% 80%, #FFF3 0%, #FFF0 80% )`,
		} }

	constructor() {
		if( Singleton.has( this ) )
			return Singleton.get( this )
		Singleton.set( this )
		DebugFinalization.assign( this )

		let element = this.element = Element.fromTagName `main-scene-content`
		element.style.setProperties( this.#styles )


		element.append(
			Element_SceneObject_.getInstance(0).element,
			Element_SceneObject_.getInstance(1).element
			)

		if( !Scoped.isDefined( element ) )
			Scoped.define( element )
		Scoped.assign( this, element )

		}

	}