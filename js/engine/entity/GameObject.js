class GameObject {
	#enable = true;
	/**Массив компонентов */
	components = {};
	constructor(_position = new Vector2(0, 0), _size = new Vector2(0, 0), _depth = 0, _attributes = {
		name: "",
		tag: "",
	}) {
		game.addPrototypeOfGameObject(this);
		this.position = _position;
		this.size = _size;
		this.depth = _depth
		this.dataCreate = Date.now();
		for (const key in _attributes) {
			this[key] = _attributes[key];
		}
	}
	IsEnable() {
		return this.#enable;
	}
	Enable() {
		this.#enable = true;
	}
	Disable() {
		this.#enable = false;
	}
	/**
	 * Изменение позиции GameObject
	 * @param newPosition Vector2 or null - новые координаты GameObject
	 * @param addPosition Vector2 or null - приращение координат GameObject
	 */
	setPosition(newPosition = null, addPosition = null) {
		if (newPosition) this.position = newPosition;
		else this.position = new Vector2(this.position.x + addPosition.x, this.position.y + addPosition.y);
	}
	/**
	 * Добавление нового компонента в GameObject.
	 * Компонент уже должен быть создан
	 * @param _component Прототип класса компонента
	 */
	addComponent(_component) {
		var newComponent = {
			[_component.className]: _component,
		}
		this.components = Object.assign(this.components, newComponent);
	}
	/**
	 * Поиск компонента по имени класса
	 * @param _componentName Имя компонента (класса)
	 */
	getComponent(_componentName) {
		for (var comp in this.components) {
			if (comp == _componentName) return this.components[comp];
		}
		return null;
	}
	/**
	 * Создание GameObject из заготовки(префаба).
	 * @param _object Префаб
	 */
	static Instantiate(_object, _parent = undefined) {
		let position;
		if (_parent) {
			position = Vector2.Sum(_object.position, _parent.position);
		} else {
			position = _object.position;
		}
		const size = _object.size;
		var newObject = new GameObject(new Vector2(position.x, position.y), new Vector2(size.x, size.y), _object.depth, _object.attributes);
		const comp = _object.createComponentsFor(newObject);
		if (comp.length !== 0) {
			comp.forEach(element => {
				newObject.addComponent(element);
			});
			comp.forEach(element => {
				element.Start();
			});
		}
		if (_object.children) {
			for (const name in _object.children) {
				if (_object.children.hasOwnProperty(name)) {
					GameObject.Instantiate(_object.children[name], newObject);
				}
			}
		}
		return newObject;
	}
	/**
	 * Удаление объекта из глобального массива объектов
	 * @param {GameObject} _object - удаляемый объект
	 */
	static Destroy(_object) {
		for (let component in _object.components) {
			for (var mono in game.prototypesMonoBehavior) {
				if (game.prototypesMonoBehavior[mono] === _object.components[component]) {
					game.prototypesMonoBehavior.splice(mono, 1);
				}
			}
		}
		for (let object in game.prototypesGameObject) {
			if (game.prototypesGameObject[object] === _object) {
				game.prototypesGameObject.splice(object, 1);
			}
		}
		return undefined;
	}
	/**
	 * Проверка присутствия объекта в глобальном массиве объектов
	 * @param {GameObject} _object
	 */
	static IsExist(_object) {
		if (game.prototypesGameObject.find(obj => obj === _object)) return true;
		else return false;
	}
	/**
	 * Поиск объекта по имени
	 * @param {String} _name - имя объекта
	 */
	static Find(_name) {
		return game.prototypesGameObject.find(obj => obj.name === _name);
	}
}