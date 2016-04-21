import React from 'react'
import ReactDOM from 'react-dom'
import {Colors, AllColorDictionary, ColorDictionary, __newColorsDictKey} from './utils.js'
import {ColorsList, Tabs, ColorPickerComponent} from './ui.js'
import NotificationCenter from './notification-center.js'

function initNotificationCenter() {
	const notificationCenter = new NotificationCenter();
	notificationCenter.registerEvent('on-color-change');
	notificationCenter.registerEvent('on-color-set-change');
	notificationCenter.registerEvent('pick-color-for');
	notificationCenter.registerEvent('on-component-update');
	window.notificationCenter = notificationCenter;
};

window.load = (colors) => {
	const tabsContainerNode =  document.getElementById('tabs-container');
	const colosListContainerNode = document.getElementById('colors-list-container');
	const colorPickerContainerNode = document.getElementById('color-picker-container');

	const defaultColorsSet = 'all';
	const colorSetsNames = Object.keys(colors);

	ReactDOM.render(React.createElement(ColorPickerComponent, {defaultColorsSet: defaultColorsSet, colors: colors}), colorPickerContainerNode);
	ReactDOM.render(React.createElement(Tabs, {items: colorSetsNames, defaultItemName: defaultColorsSet}), tabsContainerNode);
	ReactDOM.render(React.createElement(ColorsList, {colors: colors, defaultColorsSet: defaultColorsSet}), colosListContainerNode);
};

window.setColors = (_colors) => {
	let colors = parseColors(_colors);
	load(colors);
}

window.parseColors = (_colors) => {
	let colors = {
		text: 		_colors.text.reduce(function(p, c) { p[c] = [{}]; return p; }, new Object()),
		background: _colors.background.reduce(function(p, c) { p[c] = [{}]; return p; }, new Object())
	}

	Object.defineProperty(colors, 'all', {
		get: function(){
			return new AllColorDictionary(this.text, this.background);
		},
		enumerable: true
	});


	colors.text.__proto__ = colors.background.__proto__ = ColorDictionary.prototype;
	colors.text[__newColorsDictKey] = {};
	colors.background[__newColorsDictKey] = {};

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
