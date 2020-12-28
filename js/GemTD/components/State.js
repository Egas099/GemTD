class State extends MonoBehavior {
	constructor(_parent, _skills) {
		super(_parent);
		this.className = "State";
		this.effects = [];
		this.skills = _skills;
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
	addEffect() {
		let newEffect = new Effect(this);
		this.effects.push(newEffect);
		newEffect.apply();
	}
	equipSkills() {
		for (const skill in this.skills) {
			let curSkill = skills[this.skills[skill]];
			curSkill.equip.call(this, curSkill.params);
		}
	}
	Start() {
		this.equipSkills();
		this.addAlias();
	}
	Update() {
		this.effects = this.effects.filter((effect) => {
			if (effect.checkDuration()) {
				effect.undo();
				return false;
			}
			return true;
		})
	}
	addAlias() { this.parent["state"] = this; }
}
class Effect {
	constructor(_state, _settings = {
		changedProps: {
			speed: -1,
		},
		duration: 1000,
	}) {
		this.state = _state;
		this.duration = _settings.duration;
		this.changedProps = _settings.changedProps;
	}
	checkDuration() {
		return (this.applyingTime + this.duration < Date.now());
	}
	apply() {
		this.applyingTime = Date.now();
		for (const prop in this.changedProps) {
			if (this.state.existProperty(prop)) {
				this.state[prop] += this.changedProps[prop];
			}
		}
	}
	undo() {
		for (const prop in this.changedProps) {
			if (this.state.existProperty(prop)) {
				this.state[prop] -= this.changedProps[prop];
			}
		}
	}
}