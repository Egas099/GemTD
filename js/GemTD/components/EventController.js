class EventController extends MonoBehavior {
	constructor(_parent) {
		super(_parent);
		this.className = "EventController";
	}
	addListener(_eventName, _callback) {
		if (this[_eventName]) {
			this[_eventName].push(_callback);
		} else {
			this[_eventName] = new Array(_callback);
		}
	}
	callEvent(_eventName, _eventData) {
		if (this[_eventName]) {
			this[_eventName].forEach(event => {
				event.call(this, _eventData);
			});
		}
	}
	Start() {
		this.addAlias();
	}
	Update() {
	}
	addAlias() { this.parent["events"] = this; }
}