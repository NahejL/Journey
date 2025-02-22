

export default class Frozen {
	static {
		Frozen.define( this )
		}

	static define( Class ) {
		Object.freeze( Class )
		Object.freeze( Class.prototype )
		}

	static assign( candidate ) {
		Object.freeze( candidate )
		}

	}