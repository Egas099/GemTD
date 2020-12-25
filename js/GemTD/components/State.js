class State extends MonoBehavior {
	constructor(_parent) {
		super(_parent);
		this.className = "State";
	}
	existProperty(_propName) {
		return (this[_propName] === undefined) ? (false) : (true);
	}
	addProperty(_propName, _initialValue, _options) {
		let newProperty = "_" + _propName;
		this[newProperty] = {}
		this[newProperty].cur = _initialValue;
		Object.defineProperty(this, _propName, {
			get: function () {
				return this[newProperty].cur;
			},
			set: function (cur) {
				try {
					if (this[newProperty].max !== undefined) {
						if (cur > this[newProperty].max) {
							this[newProperty].cur = this[newProperty].max;
							return;
						}
					}
					if (this[newProperty].min !== undefined) {
						if (cur < this[newProperty].min) {
							this[newProperty].cur = this[newProperty].min;
							return;
						}
					}
					this[newProperty].cur = cur;
				} catch (error) {
					console.log(error);
				}
			}
		});
		for (const curValue in _options) {
			this[newProperty][curValue] = _options[curValue];
			Object.defineProperty(this, `${_propName}${upFirst(curValue)}`, {
				get: function () {
					return this[newProperty][curValue];
				},
				set: function (cur) {
					this[newProperty][curValue] = cur;
				}
			});
		}
	}
	Start() {
		this.addAlias();
	}
	Update() {
	}
	addAlias() {
		this.parent["state"] = this;
	}
}