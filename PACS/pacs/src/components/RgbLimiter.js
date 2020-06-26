/**
 * @author tapio / http://tapio.github.com/
 *
 * Brightness and contrast adjustment
 * https://github.com/evanw/glfx.js
 * brightness: -1 to 1 (-1 is solid black, 0 is no change, and 1 is solid white)
 * contrast: -1 to 1 (-1 is solid gray, 0 is no change, and 1 is maximum contrast)
 */
const THREE = window.THREE = require('three');
THREE.RgbLimiter = {

	uniforms: {

		"tDiffuse":   { value: null },
		"brightness": { value: 0 },
		"contrast":   { value: 0 },
		"ceil": {value: 1},
		"floor": {value: 0}

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform float ceil;",
		"uniform float floor;",
		"uniform float brightness;",
		"uniform float contrast;", 

		"varying vec2 vUv;",

		"void main() {",

		"gl_FragColor = texture2D( tDiffuse, vUv );",

		// "gl_FragColor.rgb =vec3(0.5,0.5,0.5) ;",
		// "gl_FragColor.rgb += brightness;",
		"if (gl_FragColor.r >= ceil ) {",
			"gl_FragColor.r = ceil ;",
		"}",
		"if (gl_FragColor.g >= ceil ) {",
			"gl_FragColor.g = ceil ;",
		"}",
		"if (gl_FragColor.b >= ceil ) {",
			"gl_FragColor.b = ceil ;",
		"}",
		"if (gl_FragColor.r <= floor ) {",
			"gl_FragColor.r = floor ;",
		"}",
		"if (gl_FragColor.g <= floor ) {",
			"gl_FragColor.g = floor ;",
		"}",
		"if (gl_FragColor.b <= floor ) {",
			"gl_FragColor.b = floor ;",
		"}",
		// "if (contrast > 0.0) {",
		// 	"gl_FragColor.rgb = (gl_FragColor.rgb - 0.5) / (1.0 - contrast) + 0.5;",
		// "} else {",
		// 	"gl_FragColor.rgb = (gl_FragColor.rgb - 0.5) * (1.0 + contrast) + 0.5;",
		// "}",

		"}"

	].join( "\n" )

};
