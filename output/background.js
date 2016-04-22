var contentCommunicationModule = new ContentCommunicationModule();
var devtoolsCommunicationModule = new DevtoolsCommunicationModule();

// Devtools communication Module
function DevtoolsCommunicationModule() {
	var connections = {};

	chrome.runtime.onConnect.addListener(function (port) {
		port.onMessage.addListener(function(message, sender, sendResponse) {
			handleMessage(message, sender, sendResponse, port);
		});

		port.onDisconnect.addListener(function(port) {
			var tabs = Object.keys(connections);
			for(var i=0, len=tabs.length; i<len; i++) {
				if(connections[tab[i]] == port) {
					delete connections[tabs[i]];
					break;
				}
			}
		});
	});

	function handleMessage(message, sender, sendResponse, port) {
		switch(message.name) {
			case 'init':
				connections[message.tabId] = port;
				chrome.tabs.executeScript(message.tabId, {file: 'content.js'});
				break;
			default:
				contentCommunicationModule.sendMessage(message);
				break;
		}
	}

	this.sendMessage = function(tabId, request) {
		connections[tabId] && connections[tabId].postMessage(request);
	}
};

// Content script communication Module
function ContentCommunicationModule() {
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		sender.tab && devtoolsCommunicationModule.sendMessage(sender.tab.id, request);
	});

	this.sendMessage = function(obj, responseCallback) {
		chrome.tabs.sendMessage(obj.tabId, obj, responseCallback);
	}
} 