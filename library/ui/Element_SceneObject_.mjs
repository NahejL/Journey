
import Multiton from "/library/Multiton.mjs"
import Scoped from "/library/Scoped.mjs"
import Frozen from "/library/Frozen.mjs"
import DebugFinalization from "/library/DebugFinalization.mjs"
import "/library/Element.mjs"
import "/library/CSSStyleDeclaration.mjs"

export default class Element_SceneObject_ {
	static {
		Multiton.define( this )
		Frozen.define( this )
		}

	get #styles() { return {
		gridColumn: "1/-1", placeSelf: "stretch",
		display: "grid", grid: "auto / subgrid",
		} }

	constructor( id ) {
		if( Multiton.has( this, id ) )
			return Multiton.get( this, id )
		Multiton.set( this, id )
		DebugFinalization.assign( this )

		let element = this.element = Element.fromTagName `main-scene-content`
		element.style.setProperties( this.#styles )

		element.append(
			Element.fromOuterHTML `<name- style="place-self: center start;" >Some Scene Object`,
			Element.fromOuterHTML `<icon- style="place-self: stretch; color: #FFF; background: center / 18px 18px no-repeat url(/library/icons/light-bulb.svg);" />`
			)

		if( !Scoped.isDefined( element ) )
			Scoped.define( element )
		Scoped.assign( this, element )

		}

	}