function clickGlobalEvent(_clickPos) {
    GameData.ClearInfoList();
    // console.log(RenderInterface.nextFrame); 
    // console.log("Клик");
}

function objectGetInfo(_object) {
    GameSystem.CreateGemInfoList(_object);
}

function button1Click() {
    GameSystem.InstantHuman();
}

function destroyThisObject(_object) {
    GameObject.Destroy(_object);
}
class GameSystem {
    
    static CreateGemInfoList(_object) {
        GameData.ClearInfoList();
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
    static InstantHuman() {
        GameObject.Instantiate({
            position: createVector2(10, 90),
            size: createVector2(40, 40),
            createComponentsFor(_parent) {
                return [
                    new SpriteRender(_parent, sprites.human, 1),
                    new MoveController(_parent, 1 + Math.random() * 3, movePath()),
                    new EnemyController(_parent, 10, 10, 10),
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
    static InstantRandomDem(_chances) {
        let arrChance = [];
        let luckyQuality;
        for (const quality in _chances)
            arrChance.push(_chances[quality]);
        // console.log(arrChance);
        const chance = Math.random() * 100;
        for (let i = 0; i <= arrChance.length; i++) {
            if (chance <= arrChance[0]) {
                return _chances[0];
            }
        }
    }
    static RandomChance(_chance) {
        if (Math.random() * 100 < _chance) {
            return true;
        } else {
            return false;
        }
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
