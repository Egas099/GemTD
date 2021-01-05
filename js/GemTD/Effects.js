const effects = {
    poisoning: (
        params = {
            priority: 0,
            damage: 1,
            damageTick: 1000,
            speedReduce: 5,//%
            duration: 3000,
        },
    ) => {
        return {
            name: "poisoning",
            params: params,
            apply: function (params) {
                if (this.state.speed) {
                    this.state.speed *= (100 - params.speedReduce) / 100;
                    this.lastTick = Date.now();
                    this.update = function () {
                        if (this.lastTick + this.effectData.params.damageTick < Date.now()) {
                            this.state.health -= this.effectData.params.damage;
                            this.lastTick = Date.now();
                        }
                    }
                    return true;
                }
                return false;
            },
            undo: function (params) {
                if (this.state.speed) {
                    this.state.speed /= (100 - params.speedReduce) / 100;
                }
                return false;
            },
        }
    },
    deceleration: (
        params = {
            speedReduce: 10,//%
            duration: 3000,
        },
    ) => {
        return {
            name: "deceleration",
            params: params,
            apply: function (params) {
                if (this.state.speed) {
                    this.state.speed *= (100 - params.speedReduce) / 100;
                    this.lastTick = Date.now();
                    this.update = function () {
                        if (this.lastTick + this.effectData.params.damageTick < Date.now()) {
                            this.state.health -= this.effectData.params.damage;
                            this.lastTick = Date.now();
                        }
                    }
                    return true;
                }
                return false;
            },
            undo: function (params) {
                if (this.state.speed) {
                    this.state.speed /= (100 - params.speedReduce) / 100;
                }
                return false;
            },
        }
    }
}