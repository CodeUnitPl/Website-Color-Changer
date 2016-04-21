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
				chrome.tabs.executeScript(null, {file: 'content.js'});
				break;
		}
	}

	this.sendMessage = function(tabId, request) {
		alert(4);
		connections[tabId] && connections[tabId].postMessage(request);
	}
};

// Content script communication Module
function ContentCommunicationModule() {
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		alert(6);
		sender.tab && devtoolsCommunicationModule.sendMessage(sender.tab.id, request);
	});

	this.sendMessage = function(obj, responseCallback) {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, obj, responseCallback);
		});
	}
} 