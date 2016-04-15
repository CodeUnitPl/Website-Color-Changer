export default class NotificationCenter {

	constructor(verbose=true) {
		this.callbacks = {}
		this.events 	= {}
		this.logger = {
			log: function(str) {
				if(verbose) {
					console.log('Notification Center [info]: ' + str);
				}
			},
			error: function(error) {
				console.error('Notification Center [error]: ' + error);
			}
		}
	}

	// Registers middleware for event name
	// On event emit, result of middleare will be passed to all event listeners
	// If middleware is not specified, value will be passed directly
	registerEvent(event, middleware) {
		if(event && !this.events[event]) {
			this.events[event] = middleware || this.defaultEventMiddleware;
			this.callbacks[event] = {};
			this.logger.log(`Event [${event}] was successfully registered with ${middleware ? 'custom middleware' : 'default middleware'}`);
		} else if(event && this.events[event]) {
			this.logger.error('Event [${event}] is already registered');
		} else {
			this.logger.error('Event name is not specified');
		}
	}

	// Default event value middleware. It is used when no middleware is specified while registering event
	defaultEventMiddleware(properties) {
		return properties;
	}


	// Emits event
	// Parameters will be preprocessed with event middleware if such was specified
	emit(event, parameters) {
		if(event && this.events[event]) {
			const _callbacks = this.callbacks[event];
			const middlewareResult = this.events[event](parameters);
			let identifiers = [];

			for(var callbackIdentifier of Object.keys(_callbacks)) {
				_callbacks[callbackIdentifier](middlewareResult);
				identifiers.push(callbackIdentifier);
			}
			this.logger.log(`Event [${event}] has been successfully emitted. ${identifiers.length} callbacks were evaluated: [${identifiers.join(', ')}]`);
		} else {
			this.logger.error(`Event [${event}] is not registered`);
		}
	}


	// Subscribes callback that will be called on event emit
	// Callback will receive event middleware result as parameters
	// Identifier is used for unsubscribing proper callback from event; if no identifier is specified function reference is used instead (it is preferable to use identifier)
	subscribeListener(event, callback, identifier) {
		if(event && this.events[event] && callback) {
			const _identifier = identifier || callback;
			this.callbacks[event][_identifier] = callback;
			this.logger.log(`Callback {${_identifier}} was successfully subscribed for event [${event}]`);
		} else if(!callback) {
			this.logger.error(`No callback is specified`);
		} else {
			this.logger.error(`[${event}] is not registered`);
		}
	}

	// Unsubscribe callback from event
	// Use identifier passed for subscribing or callback reference if identifier was not passed
	unsubscribeListener(event, identifier) {
		if(event && this.callbacks[event] && identifier) {
			const _callbacks = this.callbacks[event];
			if(_callbacks[identifier]) {
				delete _callbacks[identifier];
				this.logger.log(`Callback with identifier {${identifier}} was successfully unsubscribed from event [${event}]`);
			} else {
				this.logger.error(`No callback was found with supplied indentifier`);
			}
		} else if(!identifier) {
			this.logger.error('For unsubscribing callback, identifier is required');
		} else {
			this.logger.error(`Event [${event}] is not registered`);
		}
	}
}
