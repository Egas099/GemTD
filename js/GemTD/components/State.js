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
					console.error(error);
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
	addEffect(_effectData) {
		for (let i = 0; i < this.effects.length; i++) {
			if (this.effects[i].name === _effectData.name) {
				if (this.effects[i].priority < _effectData.params.priority) {
					this.effects[i].undo();
					this.effects.splice(i, 1);
					break;
				} else {
					this.effects[i].applyingTime = Date.now();
					return;
				}
			}
		}
		let newEffect = new Effect(this, _effectData);
		this.effects.push(newEffect);
		newEffect.apply();
	}
	equipSkills() {
		for (const skill in this.skills) {
			let curSkill = skills[this.skills[skill].title];
			curSkill.equip.call(this.parent,
				(this.skills[skill].params) ? (this.skills[skill].params) : (curSkill.params));
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
			effect.update();
			return true;
		})
	}
	addAlias() { this.parent["state"] = this; }
}
class Effect {
	constructor(_state, _effectData) {
		this.state = _state;
		if (_effectData.params.duration) {
			this.duration = _effectData.params.duration;
		} else {
			this.duration = 1000;
		}
		this.priority = _effectData.params.priority;
		this.name = _effectData.name;
		this.effectData = _effectData;
		this.update = () => { };
	}
	checkDuration() {
		return (this.applyingTime + this.duration < Date.now());
	}
	apply() {
		this.applyingTime = Date.now();
		return this.effectData.apply.call(this, this.effectData.params);
	}
	undo() {
		this.effectData.undo.call(this, this.effectData.params);
	}
	timeLeft() {
		return (this.applyingTime + this.duration - Date.now());
	}
}