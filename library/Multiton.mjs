
import "./Error.mjs"
import Frozen from "./Frozen.mjs"



class DefaultAccessor {
	#instances = new Map
	#registry = new FinalizationRegistry( key => this.#instances.delete( key ) )
	
	has( key ) { 
		return !!this.#instances.get( key )?.deref?.() 
		} 
	
	get( key ) { 
		return this.#instances.get( key )?.deref?.() 
		}
	
	set( key, value ) { 
		this.#instances.set( key, new WeakRef( value ) )
		this.#registry.register( value, key )
		}
	
	}



export default class Multiton {
	static {
		Frozen.define( this )
		}

	static #Classes = new WeakMap
	
	static #getAccessor( candidate ) {
		let Class = candidate.constructor
			, accessor = Multiton.#Classes.get( Class )

		if( accessor === undefined )
			throw Error.fromTemplate `${Multiton} tried to find candidate: ${candidate}; but it is not defined.`

		return accessor
		}

	static #getInstance = function( key, ...args ) {
		let accessor = Multiton.#Classes.get( this )

		if( accessor === undefined )
			throw Error.fromTemplate `tried to <${Multiton}>.getInstance with this: ${this} and key: ${key}; but it was not defined.`

		if( !accessor.has( key ) ) {
			if( this.length === args.length + 1 ) {
				let instance = new this( key, ...args )
				accessor.set( key, instance )
				return instance 
				}
			else
				throw Error.fromTemplate `tried to <${Multiton}>.getInstance with this: ${this} and key: ${key}; but it was not initialized.`
			}

		return accessor.get()
		}

	static #setInstance = function( key ) {
		let accessor = Multiton.#Classes.get( this )

		if( accessor === undefined )
			throw Error.fromTemplate `tried to <${Multiton}>.setInstance with this: ${this} an key: ${key}; but it was not defined and also you cant do that.`

		if( !accessor.has( key ) )
			throw Error.fromTemplate `tried to <${Multiton}>.setInstance with this: ${this} and key: ${key}; but it was not initialized and also you cant do that.`

		throw Error.fromTemplate `tried to <${Multiton}>.setInstance; but it is read-only.`
		}

	static define( Class, accessor ) {
		accessor ??= new DefaultAccessor

		if( Multiton.#Classes.has( Class ) )
			throw Error.fromTemplate `tried to Multiton.define with Class: ${Class}; but it was already defined with ${Multiton.#Classes.get( Class )}.`

		Multiton.#Classes.set( Class, accessor )

		Object.defineProperty( Class, "getInstance", {
			value: Multiton.#getInstance
			} )

		Object.defineProperty( Class, "setInstance", {
			value: Multiton.#setInstance
			} )

		}

	static isDefined( Class ) {
		return Multiton.#Classes.has( Class )
		}
	// short-form of has+get+set( init )
	static assign( candidate, key, initializer ) {
		let accessor = Multiton.#getAccessor( candidate )

		if( accessor.has( key ) )
			return accessor.get( key )

		initializer?.( candidate, key )
		accessor.set( candidate, key )
		return candidate
		}

	static has( candidate, key ) {
		let accessor = Multiton.#getAccessor( candidate )
		return accessor.has( key )
		} 

	static get( candidate, key ) {
		let accessor = Multiton.#getAccessor( candidate )
		return accessor.get( key )
		} 

	static set( candidate, key  ) {
		let accessor = Multiton.#getAccessor( candidate )
		return accessor.set( key, candidate )
		} 

	}