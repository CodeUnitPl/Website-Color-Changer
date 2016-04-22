var elements = document.querySelectorAll('*');
var colors = getColorsOfDomElement(document);

function getColorsOfDomElement(element) {
	var elements = element.querySelectorAll('*');
	var colors = {
		text: {},
		background: {}
	}

	Array.prototype.forEach.call(elements, function(element) {
		var style			= getComputedStyle(element);
		var textColor		= style.color;
		var backgroundColor	= style.backgroundColor;

		if(backgroundColor) {
			colors.background[backgroundColor] = (colors.background[backgroundColor] || []).concat(element);
		}

		if(textColor) {
			colors.text[textColor] = (colors.text[textColor] || []).concat(element);
		}
	}, this);

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