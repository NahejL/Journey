
import "./Error.mjs"
import Frozen from "./Frozen.mjs"


class DefaultAccessor {

	#instance
	
	has() { 
		return !!this.#instance?.deref?.() 
		} 
	
	get() { 
		return this.#instance?.deref?.() 
		}
	
	set( value ) { 
		this.#instance = new WeakRef( value ) 
		}
	
	}


export default class Singleton {
	static{
		Frozen.define( this )
		}

	static #Classes = new WeakMap
	
	static #getAccessor( candidate ) {
		let Class = candidate.constructor
			, accessor = Singleton.#Classes.get( Class )

		if( accessor === undefined )
			throw Error.fromTemplate `Tried to ${Singleton}.assign with candidate: ${candidate}; but it is not defined.`

		return accessor
		}

	static #getInstance = function() {
		let accessor = Singleton.#Classes.get( this )

		if( accessor === undefined )
			throw Error.fromTemplate `tried to get <${Singleton}>.instance with this: ${this}; but it was not defined.`

		if( !accessor.has() ) {
			if( this.length === 0 ) {
				let instance = new this
				accessor.set( instance )
				return instance 
				}
			else
				throw Error.fromTemplate `tried to get <${Singleton}>.instance with this: ${this}; but it was not initialized.`
			}

		return accessor.get()
		}

	static #setInstance = function() {
		let accessor = Singleton.#Classes.get( this )

		if( accessor === undefined )
			throw Error.fromTemplate `tried to set <${Singleton}>.instance with this: ${this}; but it was not defined and also you cant do that.`

		if( !accessor.has() )
			throw Error.fromTemplate `tried to set <${Singleton}>.instance with this: ${this}; but it was not initialized and also you cant do that.`

		throw Error.fromTemplate `tried to set <${Singleton}>.instance; but it is read-only.`
		}

	static define( Class, accessor ) {
		accessor ??= new DefaultAccessor

		if( Singleton.#Classes.has( Class ) )
			throw Error.fromTemplate `tried to Singleton.define with Class: ${Class}; but it was already defined with ${Singleton.#Classes.get( Class )}.`

		Singleton.#Classes.set( Class, accessor )

		Object.defineProperty( Class, "instance", {
			get: Singleton.#getInstance,
			set: Singleton.#setInstance,
			} )

		}

	static isDefined( Class ) {
		return Singleton.#Classes.has( Class )
		}
	// short-form of has+get+set( init )
	static assign( candidate, initializer ) {
		let accessor = Singleton.#getAccessor( candidate )

		if( accessor.has() )
			return accessor.get()

		initializer?.( candidate )
		accessor.set( candidate )
		return candidate
		}

	static has( candidate ) {
		let accessor = Singleton.#getAccessor( candidate )
		return accessor.has()
		} 

	static get( candidate ) {
		let accessor = Singleton.#getAccessor( candidate )
		return accessor.get()
		} 

	static set( candidate ) {
		let accessor = Singleton.#getAccessor( candidate )
		return accessor.set( candidate )
		} 

	}