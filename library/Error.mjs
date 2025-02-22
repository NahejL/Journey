
import Extension from "./Extension.mjs"
import Frozen from "./Frozen.mjs"
import "./String.mjs"


class Error_Extension {
	static {
		Extension.define( this, Error )
		Frozen.define( this )
		}

	static fromTemplate( strings, ...values ) {
		values = values.map( prettyValue )
		return Error( String.fromTemplate( strings, ...values ) )
		}

	}


function prettyValue( value ) {
	switch( typeof value ) {
	case "undefined":
		return `[undefined]`
	case "boolean":
	case "number":
	case "bigint":
		return `[${typeof value} ${value}]`
	case "string":
		return `[string "${value.truncate( 10, "..." )}"]`
	case "symbol":
		return `[symbol description: "${String(value)}"]`
	case "object": 
		if( value === null )
			return `[object null]`
		return `[object ${value.constructor?.name ?? "anonymous" }]`
	case "function":
		return `[function ${value.name ?? "anonymous"}]`
		}
	}