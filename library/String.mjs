
import Extension from "./Extension.mjs"
import Frozen from "./Frozen.mjs"


class String_Extension {
	static {
		Extension.define( this, String )
		Frozen.define( this )
		}

	static fromTemplate( strings, ...values ) {
		values = values.values()
		strings = strings.flatMap( string => [ string, values.next().value ] )
		return strings.join("")
		}

	toKebabCase( skewer = "--" ) {
		return this.replaceAll( /[A-Z0-9]/g, match => "-" + match.toLowerCase() )
			.replace( /^-/g, skewer )
		}

	truncate( length, ending = "..." ) {
		return this.replace( new RegExp( `^(.{${length}})(.{${ending.length},})`, "g" ), "$1" + ending )
		}

	}