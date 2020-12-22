class HealthBar extends MonoBehavior {
    constructor(_parent) {
        super(_parent);
        this.className = "HealthBar";
    }
    render() {
        let newSize = new Vector2(this.parent.size.x * 0.7, this.parent.size.y * 0.1);
        let newPos = new Vector2(
            this.parent.position.x - newSize.x / 2,
            this.parent.position.y - this.parent.size.y / 2 - 10
        );
        let curentBar = sprites.healthBars.black;
        RenderInterface.drawImage(
            this.depth + 0.1,
            {
                image: curentBar.img,
                sx: curentBar.sx,
                sy: curentBar.sy,
                sWidth: curentBar.sWidth,
                sHeight: curentBar.sHeight,
                x: newPos.x - 1,
                y: newPos.y - 1,
                width: newSize.x + 2,
                height: newSize.y + 2,
            }
        );
        curentBar = sprites.healthBars.red;
        RenderInterface.drawImage(
            this.depth + 0.2,
            {
                image: curentBar.img,
                sx: curentBar.sx,
                sy: curentBar.sy,
                sWidth: curentBar.sWidth,
                sHeight: curentBar.sHeight,
                x: newPos.x,
                y: newPos.y,
                width: newSize.x,
                height: newSize.y,
            }
        );
        curentBar = sprites.healthBars.lime;
        RenderInterface.drawImage(
            this.depth + 0.3,
            {
                image: curentBar.img,
                sx: curentBar.sx,
                sy: curentBar.sy,
                sWidth: curentBar.sWidth,
                sHeight: curentBar.sHeight,
                x: newPos.x,
                y: newPos.y,
                width: newSize.x / (this.maxHealth / this.healthIncrement),
                height: newSize.y,
            }
        );
        curentBar = sprites.healthBars.green;
        RenderInterface.drawImage(
            this.depth + 0.4,
            {
                image: curentBar.img,
                sx: curentBar.sx,
                sy: curentBar.sy,
                sWidth: curentBar.sWidth,
                sHeight: curentBar.sHeight,
                x: newPos.x,
                y: newPos.y,
                width: newSize.x / (this.maxHealth / this.parent.health),
                height: newSize.y,
            }
        );
    }
    Start() {
        this.depth = this.parent.getComponent("SpriteRender").depth + this.parent.depth;
        this.maxHealth = this.parent.healthMax;
        this.healthIncrement = this.parent.health;
    }
    Update() {
        if (this.healthIncrement !== this.parent.health)
            this.healthIncrement += (this.parent.health - this.healthIncrement) / 15;
        this.render();
    }
}