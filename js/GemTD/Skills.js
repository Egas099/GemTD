const skills = {
    multiTarget: {
        capture: "attack of two additional targets",
        params: {
            targetsCount: 2,
        },
        equip: function (params) {
            const AttackEnemy = this.parent.getComponent("AttackEnemy");
            AttackEnemy.addLocalEventListener("onFire", multiAttack.bind(AttackEnemy));

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
            radius: 50,
        },
        equip: function (params) {
            console.log("splash");
            const AttackEnemy = this.parent.getComponent("AttackEnemy");
            AttackEnemy.addLocalEventListener("onHit", splashDamage.bind(AttackEnemy));

            function splashDamage(_eventData) {
                const targetsNearby = findTargetsNearby(_eventData.target)
                targetsNearby.forEach(target => {
                    target.getComponent("EnemyController").takeDamage(_eventData.damage);
                });
            }
            function findTargetsNearby(_target) {
                const newTargets = game.prototypesGameObject.filter(function (object) {
                    if (object === this.target) return 0;
                    if (object.tag === "enemy") {
                        if (this.parent.state.targetType === "all" || this.parent.state.targetType === object.type) {
                            if (Vector2.Distance(_target.position, object.position) <= 60) {
                                return 1;
                            }
                        }
                    }
                    return 0;
                }.bind(AttackEnemy));
                return newTargets;
            }
        }
    }

}