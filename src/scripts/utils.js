export const __newColorsDictKey = Symbol('__newColorsDictKey');
const __colorDictionariesKey = Symbol('color-dictionaries');
const __colorSetName = Symbol('color-set-name');

export class ColorDictionary {

	constructor(name) {
		this[__newColorsDictKey] = {};
		this.name = name;
	}

	get name(){return this[__colorSetName];}
	set name(name){this[__colorSetName] = name;}

	get __keys() {
		return Object.keys(this).sort(function(a,b) {
			const _rgb1 = Colors.getRgbaComponentsFromCssString(a);
			const _rgb2 = Colors.getRgbaComponentsFromCssString(b);
			var hsl1 = Colors.rgbToHsl(..._rgb1);
			var hsl2 = Colors.rgbToHsl(..._rgb2);
			return (hsl1[0] * 0.9 + hsl1[2]*0.1)  - (hsl2[0] * 0.9 + hsl2[2]*0.1);
		});
	}

	getCurrentColor(initColor) {
		return this.getNewColor(initColor)[0] || initColor;
	}

	getNewColor(initColor) {
		return [this[__newColorsDictKey][initColor]].filter((e) => !!e);
	}

	setNewColor(initColor, newColor) {
		this[__newColorsDictKey][initColor] = newColor;
	}

	removeNewColor(initColor) {
		delete this[__newColorsDictKey][initColor];
	}
}

export class AllColorDictionary extends ColorDictionary {

	constructor(...colorDictionaries) {
		super();
		this[__colorDictionariesKey] = colorDictionaries;

		colorDictionaries.forEach(function(obj) {
			for(var key of Object.keys(obj)) {
				this[key] = (this[key] || []);
				this[key].push.apply(this[key], obj[key]);
			}
		}.bind(this));
	}

	setNewColor(initColor, newColor) {
		this[__colorDictionariesKey].forEach(function(dict) {
			dict[initColor] && dict.setNewColor(initColor, newColor);
		});
	}

	getNewColor(initColor) {
		return this[__colorDictionariesKey].map(function(dict) {
			return dict.getNewColor(initColor)[0];
		}).filter((e) => !!e);
	}

	removeNewColor(initColor) {
		this[__colorDictionariesKey].map(function(dict) {
			return dict.removeNewColor(initColor);
		})
	}

	getCurrentColor(initColor) {
		return initColor;
	}

	get newColorsObject() {
		const t = this[__colorDictionariesKey].reduce(function(p, c){ 
			p[c.name] = c[__newColorsDictKey];
			return p;
		}, {});
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

	static getRgbaComponentsFromCssString(cssColor) {
		const rgba = cssColor.match(/(\d|\.)+/g);
		let r = parseInt(rgba[0]).toString(16).replace(/^(.)$/, '0$1');
		let g = parseInt(rgba[1]).toString(16).replace(/^(.)$/, '0$1');
		let b = parseInt(rgba[2]).toString(16).replace(/^(.)$/, '0$1');
		let a = parseFloat(rgba[3]) || 1.;
		return [r, g, b, a];
	}

	static rgbaStringToHex(color) {
		const [r, g, b, a] = this.getRgbaComponentsFromCssString(color);
		let rgbHex = ['#', r, g, b].join('');
		return [rgbHex, a]; 
	}

	static rgbToHsl(r, g, b){
	 	let max = Math.max(r, g, b), min = Math.min(r, g, b);
	 	let h, s, l = (max + min) / 2;

	 	if(max == min){
	 	    h = s = 0; // achromatic
	 	}else{
	 		let d = max - min;
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