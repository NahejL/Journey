
import Frozen from "./Frozen.mjs"
import "./Error.mjs"


export default class DebugFinalization {
	static {
		Frozen.define( this )
		}

	static #registry = new FinalizationRegistry( debug => 
		console.warn( `[DebugFinalization] caught: "${debug}"` ) 
		)

	static assign( candidate ) {

		let debug

		switch( typeof candidate ) {	
		case "symbol":
			if( Symbol.keyFor( candidate ) !== undefined )
				throw Error.fromTemplate `Tried to ${Singleton}.assign with candidate: ${candidate}; but it is a registered Symbol.`
			debug = `[symbol description: "${String(candidate)}" ]`
			break
		case "object":
			if( candidate === null )
				throw Error.fromTemplate `Tried to ${Singleton}.assign with candidate: null.`
			debug = `[object constructor: ${candidate.constructor?.name ?? "undefiend-or-unamed"} ]`
			break
		case "function":
			debug = `[${candidate.prototype ? "class" : "function" } name: ${candidate.name} ]`
			break
		default:
			throw Error.fromTemplate `Tried to ${DebugFinalization}.assign with candidate: ${candidate}; but it is not of valid type: ${typeof candidate}.`
			}

		DebugFinalization.#registry.register( candidate, debug )

		}


	}