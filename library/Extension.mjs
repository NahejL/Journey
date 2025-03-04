

export default class Extension {

	static apply( source, target ) {
		let descriptors = Object.entries( Object.getOwnPropertyDescriptors( source ) )
		for( let [ key, descriptor ] of descriptors )
		switch( key ) {
		case "prototype":
		case "name":
		case "length":
			break
		default:
			Object.defineProperty( target, key, descriptor )
			}
		}
	
	}