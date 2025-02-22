
import Extension from "./Extension.mjs"
import Frozen from "./Frozen.mjs"
import "./String.mjs"
import "./Error.mjs"



class CSSStyleDeclaration_Extension {
	static {
		Extension.define( this, CSSStyleDeclaration )
		Frozen.define( this )
		}
	
	setProperties( object ) {
		for( let [ name, value ] of Object.entries( object ) )
		switch( typeof value ) {
		case "undefined":
			this.removeProperty( name.toKebabCase() )
			continue
		case "string":
			this.setProperty( name.toKebabCase(), value )
			continue
		case "object":
			switch( name ) {
			case "background":
				this.setProperty( name.toKebabCase(), value.join(", ") )
				continue
				}
		default:
			throw Error.fromTemplate `Tried to ${CSSStyleDeclaration_Extension}.setProperties with entry [ ${name}, ${value} ], but typeof value is not supported.`
			}
		}

	}