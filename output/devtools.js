var extWindow;

chrome.devtools.panels.elements.createSidebarPane(
	"Colors",
	function(sidebar) {
		sidebar.setPage('index.html');

		sidebar.onShown.addListener( (_window) => {
			extWindow = _window;
			extWindow.initComponent(sidebar);

			backgroundPageConnection.postMessage({
				name: 'init',
				tabId: chrome.devtools.inspectedWindow.tabId
			});
		});
	}
);

var backgroundPageConnection = chrome.runtime.connect({
	name: 'wcc'
});

backgroundPageConnection.onMessage.addListener(function(message) {
	var t = JSON.parse(JSON.stringify(message.colors));
	switch(message.action) {
		case 'set-colors':
			extWindow.setColors(t);
		break;
	}
});