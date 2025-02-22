
import Frozen from "./Frozen.mjs"



export default class Extension {
	static {
		Frozen.define( this )
		}


	static define( extending, extended ) {

		validate_isObjectWrittable( extended )
		validate_isObjectWrittable( extending )

		let descriptors = Object.getOwnPropertyDescriptors( extending )
			, entries = Object.entries( descriptors )

		for( let [ name, descriptor ] of entries )
		switch( name ) {
		case "displayName":
		case "length":
		case "name":
		case "prototype":
		case "arguments":
		case "caller":
			continue
		default:
			Object.defineProperty( extended, name, descriptor )
			}

		descriptors = Object.getOwnPropertyDescriptors( extending.prototype )
		entries = Object.entries( descriptors )

		for( let [ name, descriptor ] of entries )
		switch( name ) {
		case "constructor":
			continue
		default:
			Object.defineProperty( extended.prototype, name, descriptor )
			}

		}


	}



function validate_isObjectWrittable( value ) {
	switch( typeof value ) {
	case "object":
	case "function":
		return
	default:
		throw Error(`[Extension] Cannot read/write properties of value: ${value}.`)
		}
	}