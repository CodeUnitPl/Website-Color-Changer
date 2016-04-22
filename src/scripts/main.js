import React from 'react'
import ReactDOM from 'react-dom'
import {Colors, AllColorDictionary, ColorDictionary, __newColorsDictKey} from './utils.js'
import {ColorsList, Tabs, ColorPickerComponent, Console} from './ui.js'
import NotificationCenter from './notification-center.js'

function initNotificationCenter() {
	if (window.notificationCenter) { return };
	
	const notificationCenter = new NotificationCenter();
	notificationCenter.registerEvent('on-color-change');
	notificationCenter.registerEvent('on-color-set-change');
	notificationCenter.registerEvent('pick-color-for');
	notificationCenter.registerEvent('on-component-update');
	notificationCenter.registerEvent('toggle-console');
	notificationCenter.registerEvent('toggle-color-format');
	window.notificationCenter = notificationCenter;
};

window.load = (colors) => {
	const tabsContainerNode =  document.getElementById('tabs-container');
	const colosListContainerNode = document.getElementById('colors-list-container');
	const colorPickerContainerNode = document.getElementById('color-picker-container');
	const consoleContainerNode = document.getElementById('console-container');

	const defaultColorsSet = 'all';
	const colorSetsNames = Object.keys(colors);

	ReactDOM.render(React.createElement(ColorPickerComponent, {defaultColorsSet: defaultColorsSet, colors: colors}), colorPickerContainerNode);
	ReactDOM.render(React.createElement(Tabs, {items: colorSetsNames, defaultItemName: defaultColorsSet}), tabsContainerNode);
	ReactDOM.render(React.createElement(ColorsList, {colors: colors, defaultColorsSet: defaultColorsSet}), colosListContainerNode);
	ReactDOM.render(React.createElement(Console, {colors: colors}), consoleContainerNode);
};

window.setColors = (_colors) => {
	let colors = parseColors(_colors);
	load(colors);
}

window.parseColors = (_colors) => {
	let colors = {
		text: 		_colors.text.reduce(function(p, c) { p[c] = [{}]; return p; }, new ColorDictionary('text')),
		background: _colors.background.reduce(function(p, c) { p[c] = [{}]; return p; }, new ColorDictionary('background'))
	}

	Object.defineProperty(colors, 'all', {
		get: function(){
			return new AllColorDictionary(this.text, this.background);
		},
		enumerable: true
	});

	return colors;
}

window.initComponent = (sidebar, connectionProxy) => {
	initNotificationCenter();
	(function() {
		var prevHeight = document.body.clientHeight;
		const updateSidebarHeight = () => {
			var newHeight = document.body.clientHeight;
			if(prevHeight != newHeight) {
				sidebar.setHeight(newHeight + 'px');
				prevHeight = newHeight;
			}
		}
		const onColorChangeCallback = (colorChangeObject) => {
			var colorChangeAction = Object.assign(colorChangeObject);
			colorChangeAction['action'] = 'onColorChange';
			connectionProxy.postMessage(colorChangeObject);
		}

		notificationCenter.subscribeListener('on-component-update', updateSidebarHeight, 'm-on-component-update-listener');
		notificationCenter.subscribeListener('on-color-change', onColorChangeCallback,'m-on-component-update-listener');
		
		window.onresize = () => { updateSidebarHeight(); }
	})();
}
