export const __newColorsDictKey = Symbol('__newColorsDictKey');
const __colorDictionariesKey = Symbol('color-dictionaries');
export class ColorDictionary {

	constructor() {
		this[__newColorsDictKey] = {};
	}

	get __keys() {
		return Object.keys(this).sort(function(a,b) {
			var _rgb1 = Colors.hexToRgb(a);
			var _rgb2 = Colors.hexToRgb(b);
			var hsl1 = Colors.rgbToHsl(..._rgb1);
			var hsl2 = Colors.rgbToHsl(..._rgb2);
			return (hsl1[0] * 0.9 + hsl1[2]*0.1)  - (hsl2[0] * 0.9 + hsl2[2]*0.1);
		});
	}

	getNewColor(initColor) {
		return [this[__newColorsDictKey][initColor]];
	}

	setNewColor(initColor, newColor) {
		this[__newColorsDictKey][initColor] = newColor;
	}
}

export class AllColorDictionary extends ColorDictionary {

	constructor(...colorDictionaries) {
		super();
		this[__colorDictionariesKey] = colorDictionaries;
	}

	setNewColor(initColor, newColor) {
		this[__colorDictionariesKey].forEach(function(dict) {
			dict.setNewColor(initColor, newColor);
		});
	}

	getNewColor(initColor) {
		let t = this[__colorDictionariesKey].map(function(dict) {
			return dict.getNewColor(initColor);
		});
		return t;
	}
}

export class Colors {

	mergeColorDictionaries(target, ...objects) {
		objects.forEach(function(obj) {
			for(var key in obj) {
				target[key] = (target[key] || []).push(obj[key]);
			}
		});
		return target;
	}

	static rgbaStringToHex(color) {
		let rgba = color.match(/(\d|\.)+/g);
		let r = parseInt(rgba[0]).toString(16).replace(/^(.)$/, '0$1');
		let g = parseInt(rgba[1]).toString(16).replace(/^(.)$/, '0$1');
		let b = parseInt(rgba[2]).toString(16).replace(/^(.)$/, '0$1');
		let a = parseFloat(rgba[3]) || 1.;

		let rgbHex = ['#', r, g, b].join('');

		return [rgbHex, a]; 
	}

	static hexToRgb(colorHex) {
		if(colorHex[0] != '#') return false;
		colorHex = colorHex.slice(1);

		if(colorHex.length == 6) {
			var r = parseInt(colorHex.slice(0, 2), 16);
			var g = parseInt(colorHex.slice(2, 4), 16);
			var b = parseInt(colorHex.slice(4, 6), 16);
			return [r, g, b];
		}
	}

	static getColorsOfDomElement(element) {
		const elements = element.querySelectorAll('*');

		const colors = {
			text: new ColorDictionary(),
			background: new ColorDictionary(),
			get all() {
				return mergeColorDictionaries(new AllColorDictionary(this.text, this.background), this.text, this.background);
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

	static rgbToHsl(r, g, b){
	 	var max = Math.max(r, g, b), min = Math.min(r, g, b);
	 	var h, s, l = (max + min) / 2;

	 	if(max == min){
	 	    h = s = 0; // achromatic
	 	}else{
	 		var d = max - min;
	 		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	 		switch(max){
	 		 	case r: h = (g - b) / d + (g < b ? 6 : 0); break;
	 		 	case g: h = (b - r) / d + 2; break;
	 		 	case b: h = (r - g) / d + 4; break;
	 		}
	 		h /= 6;
	 	}
	 	return new Array(h * 360, s * 100, l * 100);
	} 
}