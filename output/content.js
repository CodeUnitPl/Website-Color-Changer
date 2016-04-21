var elements = document.querySelectorAll('*');
var colors = getColorsOfDomElement(document);

function rgbaStringToHex(color) {
		var rgba = color.match(/(\d|\.)+/g);
		var r = parseInt(rgba[0]).toString(16).replace(/^(.)$/, '0$1');
		var g = parseInt(rgba[1]).toString(16).replace(/^(.)$/, '0$1');
		var b = parseInt(rgba[2]).toString(16).replace(/^(.)$/, '0$1');
		var a = parseFloat(rgba[3]) || 1.;

		var rgbHex = ['#', r, g, b].join('');

		return [rgbHex, a];
	}

function getColorsOfDomElement(element) {
	var elements = element.querySelectorAll('*');
	var colors = {
		text: {},
		background: {}
	}

	for(var i=0; i<elements.length; i++) {
		var style					= getComputedStyle(elements[i]);
		var bgColorComponents		= this.rgbaStringToHex(style.backgroundColor);
		var textColorComponents		= this.rgbaStringToHex(style.color);
		bgColor = bgColorComponents[0];
		bgAlpha = bgColorComponents[1];
		textColor = textColorComponents[0];
		textAlpha = textColorComponents[1];

		if(bgColor && bgAlpha) {
			colors.background[bgColor] = (colors.background[bgColor] || []).concat(elements[i]);
		}

		if(textColor && textAlpha) {
			colors.text[textColor] = (colors.text[textColor] || []).concat(elements[i]);
		}
	}

	return colors;
}

function getColorsForDevtools(colors) {
	return {
		text: Object.keys(colors.text),
		background: Object.keys(colors.background)
	}
}

function onColorChange(request) {
	var set = request.colorsSet;
	if(set == 'all' || set == 'text') {
		var elements = colors.text[request.initialColor];
		elements && elements.forEach(function(element) {
			element.style.color = request.currentColor;
		});
	}

	if(set == 'all' || set == 'background') {
		var elements = colors.background[request.initialColor];
		elements && elements.forEach(function(element) {
			element.style.backgroundColor = request.currentColor;
		});
	}
}

chrome.runtime.sendMessage({action: 'set-colors', colors: getColorsForDevtools(colors)});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	switch(request.action) {
		case 'onColorChange':
			onColorChange(request);
			break;
	}

});