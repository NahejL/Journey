
import Singleton from "./library/Singleton.mjs"
import Frozen from "./library/Frozen.mjs"
import "./library/Element.mjs"
import "/library/CSSStyleDeclaration.mjs"
import Element_Main_Frame_ from "/library/ui/Element_Main_Frame_.mjs"

/** Naming:
 * <Scope> + ...<Specifier> + <Super>
 * eg: Element_Header_Background_
 * where:
 * 	- Element: class of the bound-lifetime-object (aka Scope) of an instance of that class.
 *  - Specifier: mixins, interfaces, traits, ... that the class abides by.
 *  - Super: class/typeof held value by an instance of that class
 **/

/** TO DO:
 **/


class _Body_ {
	static {
		
		document.body.style.setProperties({
			display: "contents",
			fontFamily: "sans-serif",
			letterSpacing: "1px",
			})

		document.body.append( Element_Main_Frame_.instance.element )
		
		Frozen.define( this )
		}
	}



