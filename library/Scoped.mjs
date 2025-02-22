
import Frozen from "./Frozen.mjs"


class DefaultAccessor {
	#instances = new Array

	add( value ) {
		this.#instances.push( value )
		}

	}



export default class Scoped {
	static {
		Frozen.define( this )
		}

	static #scopes = new WeakMap

	static define( scope, accessor ) {
		accessor ??= new DefaultAccessor

		if( Scoped.#scopes.has( scope ) )
			throw Error.fromTemplate `Tried to ${Scoped}.define with scope: ${scope}; but it was already defined.`

		Scoped.#scopes.set( scope, accessor )

		}

	static isDefined( scope ) {
		return Scoped.#scopes.has( scope )
		}

	static assign( candidate, scope ) {

		let accessor = Scoped.#scopes.get( scope )

		if( accessor === undefined )
			throw Error.fromTemplate `Tried to ${Scoped}.assign with scope: ${scope}; but it was not defined.`

		accessor.add( candidate )

		}

	}