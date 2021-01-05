const skills = {
    multiTarget: {
        params: {
            targetsCount: 2,
        },
        capture: `attack of 2 additional targets`,
        equip: function (params) {
            const AttackEnemy = this.getComponent("AttackEnemy");
            this.events.addListener("onFire", multiAttack.bind(AttackEnemy));

            function multiAttack() {
                let targets = findTargets();
                targets.forEach(target => {
                    this.fire(target);
                });
            };
            function findTargets() {
                let count = 0;
                const newTargets = game.prototypesGameObject.filter(function (object) {
                    if ((count >= params.targetsCount) || (object === this.target)) return 0;
                    if (object.getComponent("EnemyController")) {
                        if (this.parent.state.targetType === "all" || this.parent.state.targetType === object.type) {
                            if (Vector2.Distance(this.parent.position, object.position) <= this.parent.state.range) {
                                count++;
                                return 1;
                            }
                        }
                    }
                    return 0;
                }.bind(AttackEnemy));
                return newTargets;
            }
        }
    },
    splash: {
        capture: "enemies take full damage within a 50 radius of the target.",
        params: {
            radius: 60,
        },
        equip: function (params) {
            const AttackEnemy = this.getComponent("AttackEnemy");
            this.events.addListener("onHit", splashDamage.bind(AttackEnemy, params));

            function splashDamage(_params, _eventData) {
                const targetsNearby = findTargetsNearby(_params, _eventData.target)
                targetsNearby.forEach(target => {
                    target.getComponent("EnemyController").takeDamage(_eventData.damage);
                });
            }
            function findTargetsNearby(_params, _target) {
                const newTargets = game.prototypesGameObject.filter(function (object) {
                    if (object === this.target) return 0;
                    if (object.tag === "enemy") {
                        if (this.parent.state.targetType === "all" || this.parent.state.targetType === object.type) {
                            if (Vector2.Distance(_target.position, object.position) <= _params.radius) {
                                return 1;
                            }
                        }
                    }
                    return 0;
                }.bind(AttackEnemy));
                return newTargets;
            }
        }
    },
    criticalDamage: {
        capture: "",
        params: {
            сhance: 25,
            multiplier: 2,
        },
        equip: function (params) {
            const AttackEnemy = this.getComponent("AttackEnemy");
            this.events.addListener("onHit", criticalAttempt.bind(AttackEnemy, params));

            function criticalAttempt(_params, _eventData) {
                if (Math.random() * 100 <= _params.сhance) {
                    if (GameObject.IsExist(_eventData.target)) {
                        _eventData.target.getComponent("EnemyController").takeDamage(_eventData.damage * (_params.multiplier - 1));
                    }
                }
            }
        }
    },
    poisonAttack: {
        capture: "",
        params: {
            effect: {
                title: "poisoning",
                params: {
                    damage: 1,
                    damageTick: 1000,
                    speedReduce: 5,//%
                    duration: 3000,
                }
            }

        },
        equip: function (params) {
            const AttackEnemy = this.getComponent("AttackEnemy");
            this.events.addListener("onHit", poison.bind(AttackEnemy, params));

            function poison(_params, _eventData) {
                _eventData.target.state.addEffect(effects[_params.effect.title](_params.effect.params));
            }
        }
    },
    decelerationAttack: {
        capture: "",
        params: {
            effect: {
                title: "deceleration",
                params: {
                    speedReduce: 30,//%
                    duration: 3000,
                }
            }

        },
        equip: function (params) {
            const AttackEnemy = this.getComponent("AttackEnemy");
            this.events.addListener("onHit", poison.bind(AttackEnemy, params));

            function poison(_params, _eventData) {
                _eventData.target.state.addEffect(effects[_params.effect.title](_params.effect.params));
            }
        }
    }

}