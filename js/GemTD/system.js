function clickGlobalEvent(_clickPos) {
    GameSystem.ClearInfoList();
    if ((GameData.gameState == "build")&&(_clickPos.x <= 800)) {
        GameSystem.Build(_clickPos);
        GameData.buildCount--;
        if (GameData.buildCount === 0) {
            GameData.gameState = "defence";
            GameData.enemyCount = 10;
        }
    }
}
class GameSystem {
    static DieEnemy(_object){
        GameSystem.enemyes--;
        console.log(GameSystem.enemyes);
        // console.log("Убит", GameSystem.enemyes.length);
        // console.log(_object);
        // console.log("-----------------");
    }
    static enemyes = [];
    static Update(){
        let obj;
        switch (GameData.gameState) {
            case "defence":
                if (GameData.enemyCount > 0) {
                    if (Date.now() - GameData.lastSpawn > 1000) {
                        obj = GameSystem.InstantHuman();
                        // console.log("Создан", GameSystem.enemyes.length);
                        // console.log(obj);
                        // console.log("-----------------");
                        GameSystem.enemyes++;
                        console.log(GameSystem.enemyes);
                        GameData.enemyCount--;
                        GameData.lastSpawn = Date.now();
                    } 
                }   else if (GameSystem.enemyes.length === 0) {
                        GameData.wale++;
                        GameData.gameState = "view";
                        GameData.enemyCount = 10;
                    }
                break;
            case "view":
                if (!GameData.buttonBuild) {
                    GameData.buttonBuild = GameSystem.InstantButtonBuild();
                }
            default:
                break;
        }
    }
    static ActionButtonBuild(){
        if (GameData.gameState === "view") {
            GameData.gameState = "build";
        }
    }
    static Build(_clickPos){
        if (GameData.buildCount > 0) {
            GameSystem.InstantRandomGem(_clickPos);
            GameData.buildCount--;
        } 
        if (GameData.buildCount == 0) {
            GameData.gameState = GameData.stateNames[1];
            GameData.buildCount = 5;
        }
    }
    static ClearInfoList(){
        if (GameData.infoList) {
            GameData.infoList.forEach(object => {
                GameObject.Destroy(object);
            });
        }
        GameData.infoList = [];
    }
    static CreateGemInfoList(_object) {
        GameSystem.ClearInfoList();
        const gc = _object.findComponentByName("AttackEnemy");
        let text = [
            "Урон: " + gc.damage,
            "Скорострельность: " + gc.fireRate,
            "Растояние: " + gc.range,
        ]
        GameData.infoList.push(GameObject.Instantiate({
            depth: 101,
            text: text,
            position: createVector2(1000, 500),
            size: createVector2(350, 400),
            createComponentsFor(_parent) {
                return [
                    new TextRender(_parent, this.text, 11),
                    new SpriteRender(_parent, sprites.windowBack, 11),
                ];
            },
        }, ));
        GameData.infoList.push(GameObject.Instantiate({
            depth: _object.depth,
            radius: gc.range,
            position: _object.position,
            size: createVector2(350, 400),
            createComponentsFor(_parent) {
                return [
                    new ArcRender(_parent, this.radius, 5),
                ];
            },
        }, ));
        GameData.infoList.push(GameObject.Instantiate({
            depth: _object.depth,
            radius: gc.range,
            position: new Vector2(_object.position.x, _object.position.y + 10),
            size: createVector2(50, 40),
            createComponentsFor(_parent) {
                return [
                    new SpriteRender(_parent, sprites.selectionOutline, -1),
                ];
            },
        }, ));
    }
    static InstantButtonBuild(){
        return GameObject.Instantiate({
            depth: 101,
            position: createVector2(1000, 200),
            size: createVector2(350, 50),
            createComponentsFor(_parent) {
                return [
                    new SpriteRender(_parent, sprites.button, 1, GameSystem.ActionButtonBuild),
                    new TextRender(_parent, "Строить", 2),
                ];
            },
        });
    }
    static InstantHuman() {
        return GameObject.Instantiate({
            health: 10 * GameData.wale,
            position: createVector2(10, 90),
            size: createVector2(40, 40),
            createComponentsFor(_parent) {
                return [
                    new SpriteRender(_parent, sprites.human, 1),
                    new MoveController(_parent, 2, movePath()),
                    new EnemyController(_parent, this.health, this.health, 10),
                    new HealthBar(_parent),
                ];
            },
        }, );
    }
    static InstantShell(_position, _target, _damage) {
        GameObject.Instantiate({
            target: _target,
            damage: _damage,
            name: "shell",
            position: _position,
            size: createVector2(20, 20),
            createComponentsFor(_parent) {
                return [
                    new SpriteRender(_parent, sprites.gemShell, 100),
                    new ShellController(_parent, this.target, this.damage),
                    new MoveController(_parent, 15, [this.target.position])
                ];
            },
        }, );
    }
    static InstantRandomGem(_position) {
        const gem = GameSystem.GetRandomGem();
        const stat = GameData.gems.types[gem[0]].quality[gem[1]];
        GameObject.Instantiate({
            damage: stat.minDamage + Math.random() * (stat.maxDamage - stat.minDamage),
            fireRate: stat.fireRate,
            fireRange: stat.fireRange,
            depth: 1,
            position: _position,
            size: createVector2(40, 50),
            createComponentsFor(_parent) {
                return [
                    new SpriteRender(_parent, sritesGems[gem[0]+gem[1]], 0, GameSystem.CreateGemInfoList),
                    new GemController(_parent),
                    new AttackEnemy(_parent, this.damage, this.fireRange*1.5, this.fireRate),
                ];
            },
        });
    }
    static GetRandomGem() {
        var droppedQuality, droppedGem;
        let arrChance = GameData.chances.levels[GameData.curentQalityLevel].chances;
        var chance = arrChance[GameData.quality[0]];
        var luck = Math.random() * 100;
        for (let i = 0; i <= GameData.quality.length; i++) {
            if (luck <= chance) {
                droppedQuality = GameData.quality[i];
                break;
            }
            chance += arrChance[GameData.quality[i+1]];
        }
        luck = Math.random() * 100;
        chance = 12.5;
        for (let i = 0; i < 8; i++) {
            if (luck <= chance) {
                droppedGem = GameData.gemNames[i];
                break;
            }
            chance += 12.5;
        }
        return [droppedGem, droppedQuality];
    }
    static readTextFile(file, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
    }
}
