(function() {
	this.extWindow;
	this.tabId = chrome.devtools.inspectedWindow.tabId;
	this.backgroundPageConnection = chrome.runtime.connect({name: 'wcc'});
	this.connectionProxy = {
		postMessage: function(object) {
			object['tabId'] = tabId;
			backgroundPageConnection.postMessage(object);
		}
	}

	backgroundPageConnection.onMessage.addListener(function(message) {
		var t = JSON.parse(JSON.stringify(message.colors));
		switch(message.action) {
			case 'set-colors':
				extWindow.setColors(t);
			break;
		}
	});

	chrome.devtools.panels.elements.createSidebarPane(
		"Colors",
		function(sidebar) {
			sidebar.setPage('index.html');

			sidebar.onShown.addListener( (_window) => {
				extWindow = _window;
				extWindow.initComponent(sidebar, this.connectionProxy);
				connectionProxy.postMessage({name: 'init'});
			});
		}
	);
})();