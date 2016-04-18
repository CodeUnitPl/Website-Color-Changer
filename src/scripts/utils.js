export default class Colors {

	constructor(...args) { /* ... */ }

	static rgbaStringToHex(color) {
		let rgba = color.match(/(\d|\.)+/g);
		let r = parseInt(rgba[0]).toString(16).replace(/^(.)$/, '0$1');
		let g = parseInt(rgba[1]).toString(16).replace(/^(.)$/, '0$1');
		let b = parseInt(rgba[2]).toString(16).replace(/^(.)$/, '0$1');
		let a = parseFloat(rgba[3]) || 1.;

		let rgbHex = ['#', r, g, b].join('');

		return [rgbHex, a]; 
	}

	static getColorsOfDomElement(element) {
		const elements = element.querySelectorAll('*');

		const colors = {
			text: {},
			background: {},
			get all() {
				var allColors = Array.prototype.concat(Object.keys(this.text), Object.keys(this.background));
				var uniqueColors = Array.from(allColors);
				var result = {};
				for(var color of uniqueColors) {
					result[color] = Array.prototype.concat(this.text[color], this.background[color]);
				}
				return result;
			}
		}

		for(let i=0; i<elements.length; i++) {
			const style						= getComputedStyle(elements[i]);
			const [bgColor, bgAlpha]		= this.rgbaStringToHex(style.backgroundColor);
			const [textColor, textAlpha]	= this.rgbaStringToHex(style.color);

			if(bgColor && bgAlpha) {
				colors.background[bgColor] = (colors.background[bgColor] || []).concat(elements[i]);
			}

			if(textColor && textAlpha) {
				colors.text[textColor] = (colors.text[textColor] || []).concat(elements[i]);
			}
		}

		return colors;
	}
}