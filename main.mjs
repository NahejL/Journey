

// ### RANDOM SHIT


console.tee = value => { console.log( value ); return value }


class Identity { constructor( _ ) { return _ } }


function Stamper( key ) {
	return eval( `( class ${key}_Stamper extends Identity {
		#${key}
		constructor( target, value ) { 
			super( target )
			target.#${key} = value 
			}
		static get( target ) { return target.#${key} }
		static has( target ) {
			try { target.#${key}; return true }
			catch( error ) { return false }
			}
		} )` )
	}



// ### FIRST ORDER - SERIALLY


class AbstractMixinBase {

	// @Abstract< constructor => boolean >
	static get has() {
		throw Error( `${this} tried to get "has", which is abstract and must be overridden.` )
		}

	// @Abstract< ( constructor, implementation ) => void | throw >
	static get set() {
		throw Error( `${this} tried to get "set", which is abstract and must be overridden.` )
		}

		// @Abstract< constructor => implementation | throw > 
	static get get() {
		throw Error( `${this} tried to get "get", which is abstract and must be overridden.` )
		}
		
	static asserSettable( constructor ) {

		if( this.has( constructor ) )
			throw Error( `${this} tried to "asserSettable" constructor: ${constructor}, but it already had it.` )
		
		}
		
	static asserGettable( constructor ) {
		
		if( typeof constructor !== "function" ) 
			throw Error( `${this} tried to "asserGettable" for constructor: ${constructor}, but it is expected to be of type "funciton".` )

		if( !this.has( constructor ) )
			throw Error( `${this} tried to "asserGettable" for constructor: ${constructor}, but it did not have it.` )
		
		}

	}


class DebugMixin extends AbstractMixinBase {

	static #constructors = new WeakSet

	static has( constructor ) {
		return this.#constructors.has( constructor )
		}

	static set( constructor, options ) {
		super.asserSettable( constructor )

		this.#constructors.add( constructor )

		options ??= {}
		options.withPropertiesValues ??= []

		Object.defineProperty( constructor, "toString", {
			value: this.#debugConstructorToString.bind( constructor, options )
			} )

		Object.defineProperty( constructor.prototype, "toString", {
			value: this.#debugPrototypeToString.bind( constructor.prototype, options )
			} )

		}

	static get( constructor ) {
		return this.has( constructor )
		}

	static #debugConstructorToString( options ) {
		return `[ <class> ${this.name} ]`
		}

	static #debugPrototypeToString( options ) {
		let values = [] 
		
		for( let name of options.withPropertiesValues )
		try { values.push([ name, this[name] ]) }
		catch( error ) { values.push([ name, `<error> ${error}` ]) }
		
		values = values
			.map( entry => entry.join(": ") )
			.join(", ")
			.replace( /(^.)/g, " $1" )
			.replace( /(.$)/g, "$1 " )

		let name = this.constructor.name || "<anonymous>"

		return `[${typeof this} of ${name}${values}]`
		}

	constructor( instance ) {
		throw Error( `(new) ${DebugMixin} tried to construct, but it is not implemented.` )
		}

	static {
		DebugMixin.set( this )
		DebugMixin.set( Identity )
		DebugMixin.set( AbstractMixinBase )
		}

	}


class FrozenMixin extends AbstractMixinBase {

	static has( constructor ) {
		return Object.isFrozen( constructor )
			&& Object.isFrozen( constructor.prototype )
		}

	static set( constructor ) {	
		super.asserSettable( constructor )

		Object.freeze( constructor )
		Object.freeze( constructor.prototype )
		
		}

	static get( constructor ) {
		return this.has( constructor )
		}

	constructor( instance ) {
		super()
		Object.freeze( instance )
		}

	static {
		DebugMixin.set( this )
		FrozenMixin.set( this )
		FrozenMixin.set( Identity )
		FrozenMixin.set( DebugMixin )
		FrozenMixin.set( AbstractMixinBase )
		}

	}


function FactorizedStampedMixin( key ) {
	return class AbstractStampedMixinBase extends AbstractMixinBase {

		static #Stamper = Stamper( key )		

		static has( constructor ) {
			return Object.hasOwn( constructor, key )
			}

		static set( constructor, implementation ) {
			super.asserSettable( constructor )

			new AbstractStampedMixinBase.#Stamper( constructor, implementation )

			Object.defineProperty( constructor, key, {
				get: () => AbstractStampedMixinBase.#Stamper.get( constructor )
				} )

			}

		static get( constructor ) {
			super.asserGettable( constructor )

			return this.#Stamper.get( constructor )
			}

		static {
			DebugMixin.set( this )
			FrozenMixin.set( this )
			}

		}
	}


class AbstractAssociativeMixinBase extends AbstractMixinBase {

	static get associator() {
		throw Error( `${this} tried to get "associator", but it is abstract and must be overridden.` )
		}

	static has( constructor ) {
		return this.associator.has( constructor )
		}

	static set( constructor, implementation ) {
		this.associator.set( constructor, implementation )
		}

	static get( constructor ) {
		return this.associator.get( constructor )
		}

	static {
		DebugMixin.set( this )
		FrozenMixin.set( this )
		}

	}


class WeakAssociativeMixer extends FactorizedStampedMixin("associator") {

	static set( constructor, entries ) {
		super.set( constructor, new WeakMap( entries ) )
		}

	static {
		DebugMixin.set( this )
		FrozenMixin.set( this )
		}

	}


class AbstractAttributiveMixinBase extends AbstractMixinBase {
	// abstract Mixin which stores its implementors in a Key-like

	static get attributor() {
		throw Error( `${this} tried to get "attributor", but it is abstract and must be overridden.` )
		}

	static has( constructor ) {
		return Reflect.has( constructor, this.attributor )
		}

	static set( constructor, implementation ) {
		super.asserSettable( constructor )

		Reflect.set( constructor, this.attributor, implementation, constructor )
		}

	static get( constructor ) {
		super.asserGettable( constructor )

		return Reflect.get( constructor, this.attributor, constructor )
		}

	static {
		DebugMixin.set( this )
		FrozenMixin.set( this )
		}

	}


class SymbolAttributiveMixer extends FactorizedStampedMixin("attributor") {

	static set( constructor, description ) {
		super.set( constructor, Symbol( description ) )
		}

	static {
		DebugMixin.set( this )
		FrozenMixin.set( this )
		}

	}


class AbstractEquivicativeMixinBase extends AbstractMixinBase {
	// abstract Mixin which stores its implementors in a Set-like

	static get equivicator() {
		throw Error( `${this} tried to get "attributor", but it is abstract and must be overridden.` )
		}

	static has( constructor ) {
		return this.equivicator.has( constructor )
		}

	static set( constructor ) {
		this.equivicator.add( constructor )
		}

	static get( constructor ) {
		return this.has( constructor )
		}

	static {
		DebugMixin.set( this )
		FrozenMixin.set( this )
		}

	}


class WeakEquivicativeMixer extends FactorizedStampedMixin("equivicator") {

	static set( constructor, entries ) {
		super.set( constructor, new WeakSet( entries ) )
		}

	static {
		DebugMixin.set( this )
		FrozenMixin.set( this )
		}

	}



// ### SECOND ORDER - ALPHABETIC - MIXINS

class SingletonMixin extends AbstractAssociativeMixinBase {

	static #applyReflectedMethod( constructor, options, name, method, ...args ) {
		// no need to validate constructor
		let implementation = this.get( constructor )
		
		if( !implementation && !options.getDefaultImplementation )
			throw Error( `${SingletonMixin} tried to #applyReflectedMethod for constructor ${constructor}, but is was not and cannot be instantiated` )
		else 
			implementation = options.getDefaultImplementation()

		return method.apply( implementation, args )
		}

	static #getReflectedGetter( constructor, options, name, getter ) {
		// node need to validate constructor 
		let implementation = super.get( constructor )

		if( !implementation && !options.getDefaultImplementation )
			throw Error( `Attempted to get "${name}" in (reflected) ${constructor.name} before instantiated` )
		else 
			implementation = options.getDefaultImplementation()

		return getter.call( implementation )
		}

	static #setReflectedSetter( constructor, options, name, setter, value ) {
		// no need to validate constructor
		let implementation = this.get( constructor )

		if( !implementation && !options.getDefaultImplementation )
			throw Error( `Attempted to set "${name}" in (reflected) ${constructor.name} before instantiated` )
		else 
			implementation = options.getDefaultImplementation()

		return setter.call( implementation, value )
		}

	static #reflectProperties( constructor, options ) {
		
		for( let [ name, descriptor ] of Object.entries( Object.getOwnPropertyDescriptors( constructor.prototype ) ) ) 
		
		if( name === "constructor" 
			|| Object.hasOwn( constructor, name ) 
			|| options.excludePrototypeProperties.includes( name ) )
			continue
		
		else if( "value" in descriptor )
			Object.defineProperty( constructor, name, {
				// configurable, enumerable, writable
				...descriptor, // this is not thought through
				value: "value" in descriptor && typeof descriptor.value === "function"
					?	this.#applyReflectedMethod.bind( this, constructor, options, name, descriptor.value )
					: descriptor.value,
				} )
		
		else 
			Object.defineProperty( constructor, name, {
				// configurable, enumerable, writable
				...descriptor, // this is not thought through
				get: "get" in descriptor 
					? this.#getReflectedGetter.bind( this, constructor, options, name, descriptor.get )
					: undefined ,
				set: "set" in descriptor 
					? this.#setReflectedSetter.bind( this, constructor, options, name, descriptor.set ) 
					: undefined,
				} )
		
		}

	static set( constructor, options_or_getDefaultImplementation ) {
		super.asserSettable( constructor )
		super.set( constructor, null )

		let options = typeof options_or_getDefaultImplementation === "object" ? options_or_getDefaultImplementation : {}

		options.reflectPrototypeProperties ??= true
		options.excludePrototypeProperties ??= []
		options.getDefaultImplementation ??= typeof options_or_getDefaultImplementation === "function" ? options_or_getDefaultImplementation : undefined

		if( options.reflectPrototypeProperties )
		this.#reflectProperties( constructor, options )

		Object.defineProperty( constructor, "instance", {
			get: this.get.bind( this, constructor ) , 
			} )

		}

	static hasInstance( constructor ) {
		super.asserGettable( constructor )
		return !!super.get( constructor )
		}

	static getInstance( constructor ) {
		super.asserGettable( constructor )
		return super.get( constructor )
		}

	static setInstance( candidate ) {
		let { constructor } = candidate

		if( this.hasInstance( constructor ) )
			throw Error( `${SingletonMixin} tried to "setInstance" on constructor: ${constructor}, but it already has one.` )

		if( !( candidate instanceof constructor) )
			throw Error( `Something is horribly wrong` )

		super.set( constructor, candidate )
		}

	constructor( candidate ) {
		super()
		let { constructor } = candidate

		let implementation = SingletonMixin.getInstance( constructor )

		if( implementation )
			return implementation

		SingletonMixin.setInstance( candidate )
		return candidate
		}

	static {
		DebugMixin.set( this )
		WeakAssociativeMixer.set( this )
		FrozenMixin.set( this )
		}
	
	}


class MultitonMixin extends AbstractAssociativeMixinBase {

	static set( constructor ) {
		this.asserSettable( constructor )
		super.set( constructor, new WeakMap )
		}

	constructor( candidate, key ) {
		super()
		let { constructor } = candidate 

		if( !MultitonMixin.has( constructor ) )
			throw Error( `(new) ${this} tried to "construct" candidate: ${candidate}, but it is not implemented.` )

		let implementation = MultitonMixin.get( constructor )

		if( implementation.has( key ) )
			return implementation.get( key )

		implementation.set( key, candidate )
		return candidate
		}

	static {
		DebugMixin.set( this )
		WeakAssociativeMixer.set( this )
		FrozenMixin.set( this )
		}

	}


class ViewMixin extends AbstractAssociativeMixinBase {

	// is constructor a ViewMixin
	static has( constructor ) {
		return super.has( constructor ) 
		}

	// make constructor a ViewMixin
	static set( constructor, element = null ) {
		super.asserSettable( constructor )
		super.set( constructor, element && new WeakRef( element ) )

		Object.defineProperty( constructor.prototype, "element", {
			get: () => ViewMixin.getElement( constructor )
			} )

		}

	// take constructor's ViewMixin
	static get( constructor ) {
		super.asserGettable( constructor )
		return super.get( constructor )
		}

	static hasElement( constructor ) {
		super.asserGettable( constructor )
		return !!super.get( constructor )?.deref?.()
		}

	static getElement( constructor ) {
		super.asserGettable( constructor )
		return super.get( constructor )?.deref?.()
		}

	static setElement( constructor, element ) {
		
		if( this.hasElement( constructor ) )
			throw Error( `${ViewMixin} tried to "setElement" on constructor ${constructor}, but it already has one` )

		if( !(element instanceof Element) )
			throw Error( `(new) ${this} tried to construct with element ${element}, but it is not an ${Element}` )

		super.set( constructor, new WeakRef( element ) )
		}

	constructor( candidate, element, ...children ) {
		super()
		let { constructor } = candidate

		let implementation = ViewMixin.getElement( constructor )

		if( implementation )
			return implementation

		ViewMixin.setElement( constructor, element )

		for( let child of children )
		if( child instanceof Element )
			element.append( child )
		else if( child.element instanceof Element )
			element.append( child.element )
		else
			throw Error( `(new) ${this} tried to construct with child: ${child}, which does not provide any ${Element}.` )

		}

	static {
		DebugMixin.set( this )
		WeakAssociativeMixer.set( this )
		FrozenMixin.set( this )
		}

	}


class DraggableViewMixin extends AbstractEquivicativeMixinBase {

	static set( constructor ) {

		if( !ViewMixin.has( constructor ) )
			throw Error( `${this} tried to "set" constructor: ${constructor}, but it is not of ${ViewMixin}.` )

		super.set( constructor )

		}

	constructor( candidate, callback ) {
		super()

		if( !DraggableViewMixin.has( candidate.constructor ) )
			throw Error( `(new) ${DraggableViewMixin} tried to construct candidate: ${candidate}, but it is not of DraggableViewMixin.` )

		let { element } = candidate
			, cursor

		element.style.touchAction = "none"

		element.addEventListener( "pointerdown", event => {
			if( event.target !== element )
				return

			element.setPointerCapture( event.pointerId )

			} )

		element.addEventListener( "gotpointercapture", event => {
			if( !element.hasPointerCapture( event.pointerId ) )
				return

			cursor = element.style.cursor
			element.style.cursor = "grabbing"

			} )

		element.addEventListener( "lostpointercapture", event => {

			element.style.cursor = cursor

			} )

		element.addEventListener( "pointermove", event => {
			if( !element.hasPointerCapture( event.pointerId ) )
				return 

			callback({ 
				x: event.movementX,
				y: event.movementY
				})

			} )

		}

	static {
		DebugMixin.set( this )
		WeakEquivicativeMixer.set( this )
		FrozenMixin.set( this )
		}

	}


// ### THIRD ORDER - ALPHABETIC - COMPONENTS

class AddNodeView {
	static { 
		DebugMixin.set( this )
		ViewMixin.set( this )
		SingletonMixin.set( this, () => new this ) 
		FrozenMixin.set( this )
		}

	constructor( ...children ) {

		let instance = new SingletonMixin( this )
		if( instance !== this )
			return instance 

		let element = document.createElement( "add-action-view" )

		element.setAttribute( "style", `
			width: 30px; height: 30px;
			display: grid; place-content: center;
			border: 1px solid #000; border-radius: 12px;
			background: #fff;
			cursor: pointer;
			` )

		element.addEventListener( "click", event => {
			BoardItemsModel.addItem( new NodeModel )
			} )

		element.textContent = "+"

		new ViewMixin( this, element, ...children )
		new FrozenMixin( this )
		}	

	}


class BoardActionsView {
	static {
		DebugMixin.set( this )
		ViewMixin.set( this )
		SingletonMixin.set( this, () => new this )
		FrozenMixin.set( this )
		}

	constructor( ...children ) {

		let instance = new SingletonMixin( this )
		if( instance !== this )
			return instance 

		let element = document.createElement( "board-actions-view" )

		element.setAttribute( "style", `
			position: absolute; inset: auto 0px 0px auto;
			padding: 8px;
			display: flex; flex-flow: column nowrap;
			gap: 8px;
			` )

		new ViewMixin( this, element, ...children )
		new FrozenMixin( this )
		}

	}


class BoardItemsModel {
	static {
		DebugMixin.set( this )
		SingletonMixin.set( this, () => new this )
		FrozenMixin.set( this )
		}

	#db
	#items
	#resolvers

	constructor() {

		let instance = new SingletonMixin( this )
		if( instance !== this )
			return instance 

		this.#items = new Set

		this.#reset()

		new FrozenMixin( this )
		}

	#reset() {
		// resolve will pass important data
		// multiple calls to resolve must be coalest
		let { resolve, promise } = this.#resolvers = Promise.withResolvers()
		let pendingChanges = new Map
		
		this.#resolvers.resolve = entries => {
			
			for( let [ item, is ] of entries )
			if( is !== this.#items.has( item ) )
				pendingChanges.set( item, is )
			else
				pendingChanges.delete( item )

			resolve()
			}

		this.#resolvers.promise = promise.then( () => {
			this.#reset()
			return pendingChanges.entries()
			} )

		}

	#watch( watcher, entries ) {
		for( let [ item, is ] of entries )
				watcher( item, is )
		this.#resolvers.promise.then( entries => this.#watch( watcher, entries ) )	
		}

	watchEntries( watcher ) {
		this.#watch( watcher, this.#items.values().map( item => [ item, true ] ) )
		}

	addItem( item ) {
		this.#resolvers.resolve([[ item, true ]])
		}

	}


class BoardItemsView {
	static {
		DebugMixin.set( this )
		ViewMixin.set( this )
		SingletonMixin.set( this, () => new this )
		FrozenMixin.set( this )
		}

	#associator = new WeakMap

	constructor( ...children ) {
		
		let instance = new SingletonMixin( this )
		if( instance !== this )
			return instance 

		let element = document.createElement("board-items-view")

		element.setAttribute( "style", `
			--x: 0; --x-px: calc( var(--x) * 1px );
			--y: 0; --y-px: calc( var(--y) * 1px );
			transform: translate( var(--x-px), var(--y-px) );
			grid-area: 1/1; place-self: center;
			width: 0px; height: 0px;
			display: grid; grid: 0px / 0px; 
			overflow: visible;
			` )
		
		BoardModel.offset.watch( ({ x, y }) => {
			element.style.setProperty( "--x", x ) 
			element.style.setProperty( "--y", y ) 
			} )

		BoardItemsModel.watchEntries( ( item, is ) => {

			if( !is ) {
				this.associator.get( item ).remove()
				this.associator.delete( item )
				return
				}

			let element
			
			switch( item.type ) {
			case "node":
				element = new NodeView( item ).element
				break
			case "edge":
				element = new EdgeView( item ).element
				break
			default:
				throw `unknown item type ${item.type}`
				}

			this.#associator.set( item, element )
			this.element.append( element )

			} )

		new ViewMixin( this, element, ...children  )
		new FrozenMixin( this )
		}

	}


class BoardMetaView {
	static {
		DebugMixin.set( this )
		ViewMixin.set( this )
		SingletonMixin.set( this, () => new this  )
		FrozenMixin.set( this )
		}

	constructor( ...children ) {
		
		let instance = new SingletonMixin( this )
		if( instance !== this )
			return instance 

		let element = document.createElement("coord-view")

		element.setAttribute( "style", `
			position: absolute; inset: 0 auto auto 0;
			padding: 8px; display: block;
			background: #FFF;
			box-shadow: 1px 1px 2px -1px #000;
			` )

		BoardModel.watch( ({ x, y, h, w }) => 
			element.textContent = `x: ${x}; y: ${y}; w: ${w}; h: ${h};` )

		new ViewMixin( this, element, ...children )
		new FrozenMixin( this )
		}

	}


class BoardModel {

	static #Offset = class BoardModel_Offset {
		static {
			DebugMixin.set( this )
			FrozenMixin.set( this )
			}

		#accessors

		constructor( accessors ) {
			this.#accessors = accessors

			new FrozenMixin( this )
			}

		watch( callback ) {
			callback( this.#accessors.serialized )
			this.#accessors.promise.then( () => this.watch( callback ) )
			}

		moveBy({ x, y }) {
			this.#accessors.x += x 
			this.#accessors.y += y 
			this.#accessors.resolve()
			}

		}

	static get Offset() { return this.#Offset }

	static {
		DebugMixin.set( this )
		SingletonMixin.set( this, () => new this )
		FrozenMixin.set( this )
		}

	#x; #y;
	#w; #h;
	#resolvers

	#accessors = Object.create( null, {
		serialized: { get: () => this.#serialized },
		promise: { get: () => this.#resolvers.promise },
		resolve: { get: () => this.#resolvers.resolve },
		x: { 	get: () => this.#x,
					set: x => this.#x = x },
		y: { 	get: () => this.#y,
					set: y => this.#y = y },
		} )

	get #defaultValues() { 
		return {
			x: 0, y: 0,
			w: 1, h: 1,
			}
		}	

	constructor() {
		
		let instance = new SingletonMixin( this )
		if( instance !== this )
			return instance 

		let values = localStorage.getItem("board-model")
		try { values = JSON.parse( value ) } 
		catch(element) {}
		values ??= this.#defaultValues

		this.#x = values.x
		this.#y = values.y
		this.#w = values.w
		this.#h = values.h

		this.#reset()

		new FrozenMixin( this )
		}

	#reset() {
		this.#resolvers = Promise.withResolvers()
		this.#resolvers.promise.then( () => this.#reset() )
		}

	get #serialized() {
		return {
			x: this.#x, y: this.#y,
			w: this.#w, h: this.#h,
			}
		}

	get offset() {
		return new this.constructor.Offset( this.#accessors )
		}

	set size({ w, h }) {
		if( this.#w === w && this.#h === h )
			return

		this.#w = w
		this.#h = h
		this.#resolvers.resolve()

		}

	watch( watcher ) {
		watcher( this.#serialized )
		this.#resolvers.promise.then( () => this.watch( watcher ) )
		}

	}


class BoardView {
	static {
		DebugMixin.set( this )
		ViewMixin.set( this )
		DraggableViewMixin.set( this )
		SingletonMixin.set( this, () => new this )
		FrozenMixin.set( this )
		}


	constructor( ...children ) {
		
		let instance = new SingletonMixin( this )
		if( instance !== this )
			return instance 

		let element = document.body
		element.setAttribute( "style", `
			margin: 0px;
			position: fixed; inset: 0px;
			width: 100vw; height 100vh;
			display: grid; grid: auto / auto;
			place-content: stretch; place-items: stretch;
			--x: 0; --x-px: calc( var(--x) * 1px );
			--y: 0; --y-px: calc( var(--y) * 1px );
			background:
				calc( var(--x-px) + 10px ) calc( var(--y-px) + 10px ) / 20px 20px radial-gradient( #000 1px, #0000 1px ),
				calc( var(--x-px) + 20px ) calc( var(--y-px) + 20px ) / 20px 20px radial-gradient( #000 1px, #0000 1px );
			cursor: grab;
			user-select: none;
			font-family: monospace, sans-serif;
			--x-font-width: 200%; --x-font-stretch: 200%;
			letter-spacing: .5px;
			` )

		BoardModel.offset.watch( ({ x, y }) => {
			element.style.setProperty( "--x", x )
			element.style.setProperty( "--y", y )
			} )

		let observer = new ResizeObserver( entries => {
			for( let { contentBoxSize: [ box ] } of entries ) {
				BoardModel.size = { w: box.inlineSize, h : box.blockSize }
				}
			} )

		observer.observe( element )

		new ViewMixin( this, element, ...children )
		new DraggableViewMixin( this, movement => 
			BoardModel.offset.moveBy( movement ) )
		new FrozenMixin( this )
		}

	}


class NodeHandleView {
	static {
		DebugMixin.set( this )
		ViewMixin.set( this )
		DraggableViewMixin.set( this )
		MultitonMixin.set( this )
		FrozenMixin.set( this )
		}

	constructor( item, ...children ) {

		let instance = new MultitonMixin( this, item )
		if( instance !== this )
			return instance 

		let element = document.createElement("node-handle-view")

		element.setAttribute( "style", `
			flex: 0 0 auto; place-self: start stretch;
			padding: 4px 6px; 
			display: grid; place-content: center;
			background: orange; color: #FFF;
			` )

		element.textContent = "Node"

		new ViewMixin( this, element, ...children )
		new DraggableViewMixin( this, movement => item.moveBy( movement ) )
		new FrozenMixin( this )
		}

	}


class NodeModel {
	
	static #Offset = class NodeModel_Offset {
		static {
			DebugMixin.set( this )
			FrozenMixin.set( this )
			}

		#accessors

		constructor( accessors ) {
			this.#accessors = accessors

			new FrozenMixin( this )
			}

		watch( callback ) {
			callback( this.#accessors.serialized )
			this.#accessors.promise.then( () => this.watch( callback ) )
			}

		moveBy({ x, y }) {
			this.#accessors.x += x 
			this.#accessors.y += y 
			this.#accessors.resolve()
			}


		}

	static get Offset() { return this.#Offset }

	static {
		DebugMixin.set( this )
		FrozenMixin.set( this )
		}

	#x; #y;
	#resolvers

	#accessors = Object.create( null, {
		serialized: { get: () => this.#serialized },
		promise: { get: () => this.#resolvers.promise },
		resolve: { get: () => this.#resolvers.resolve },
		x: { 	get: () => this.#x,
					set: x => this.#x = x },
		y: { 	get: () => this.#y,
					set: y => this.#y = y },
		} )

	get #defaultValues() { 
		return {
			x: 0, y: 0,
			}
		}	

	#reset() {
		this.#resolvers = Promise.withResolvers()
		this.#resolvers.promise.then( () => this.#reset() )
		}

	get #serialized() {
		return {
			x: this.#x, y: this.#y,
			}
		}

	constructor() {
		
		let values = this.#defaultValues

		this.#x = values.x
		this.#y = values.y

		this.#reset()

		new FrozenMixin( this )
		}

	get offset() {
		return new this.constructor.Offset( this.#accessors )
		}

	moveBy({ x, y }) {
		this.#x += x
		this.#y += y
		this.#resolvers.resolve()
		}

	get type() { return "node" }

	}


class NodeView {
	static {
		DebugMixin.set( this )
		ViewMixin.set( this )
		MultitonMixin.set( this )
		FrozenMixin.set( this )
		}

	constructor( item, ...children ) {

		let instance = new MultitonMixin( this, item )
		if( instance !== this )
			return instance

		let element = document.createElement( "node-view" )

		element.setAttribute( "style", `
			--x: 0; --x-px: calc( var(--x) * 1px );
			--y: 0; --y-px: calc( var(--y) * 1px );
			transform: translate( var(--x-px), var(--y-px) );
			grid-area: 1 / 1; place-self: start;
			min-width: 50px; min-height: 80px;
			display: grid; grid: auto-flow min-content / auto;
			border-radius: 6px;
			background: #FFF;
			box-shadow: 0px 2px 2px -1px #000;
			overflow: hidden;
			` )

		item.offset.watch( ({ x, y }) => {
			element.style.setProperty( "--x", x )
			element.style.setProperty( "--y", y )
			} )

		new ViewMixin( this, element, new NodeHandleView( item ) )
		new FrozenMixin( this )
		}

	}


new BoardView(
	BoardMetaView,
	new BoardActionsView(
		AddNodeView,
		),
	BoardItemsView,
	)
