
import { GraphEditorElement, RenderGraphElement, RenderNodeElement  } 
	from "./library/module.mjs"


// create object properties view
// create edge rendering
// create node's ports
// create a canvas node ( ports + shader )
// create node meta data ( time, memory, ... ) 





let content = GraphEditorElement.create({
	graph: RenderGraphElement.create({},
		RenderNodeElement.create({ name: "z-buffer", 
			position: [ -100, 0 ], }),
		RenderNodeElement.create({ name: "ambient",
			position: [ 0, 150 ], }),
		RenderNodeElement.create({ name: "diffused",
			position: [ 0, 0 ], }),
		RenderNodeElement.create({ name: "specular",
			position: [ 0, -150 ], }),
		RenderNodeElement.create({ name: "color",
			position: [ 100, 0 ], }),
		)
	})

document.body.append( content )
document.adoptedStyleSheets = [ new CSSStyleSheet ]
document.adoptedStyleSheets[0].replaceSync( `
	:root {
		overflow: hidden;
		font-family: sans-serif;
		letter-spacing: .6px;
		touch-action: none;
		}
	body {
		display: contents;
		}
	` )







