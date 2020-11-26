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
        RenderInterface.drawImage(
            this.depth + 0.1,
            sprites.blackPixel,
            undefined,
            undefined,
            undefined,
            undefined,
            newPos.x - 1,
            newPos.y - 1,
            newSize.x + 2,
            newSize.y + 2,
        );
        RenderInterface.drawImage(
            this.depth + 0.2,
            sprites.redPixel,
            undefined,
            undefined,
            undefined,
            undefined,
            newPos.x,
            newPos.y,
            newSize.x,
            newSize.y,
        );
        RenderInterface.drawImage(
            this.depth + 0.3,
            sprites.limePixel,
            undefined,
            undefined,
            undefined,
            undefined,
            newPos.x,
            newPos.y,
            newSize.x / (this.maxHealth / this.healthIncrement),
            newSize.y,
        );
        RenderInterface.drawImage(
            this.depth + 0.4,
            sprites.greenPixel,
            undefined,
            undefined,
            undefined,
            undefined,
            newPos.x,
            newPos.y,
            newSize.x / (this.maxHealth / this.parent.health),
            newSize.y,
        );
    }
    Start() {
        this.depth = this.parent.findComponentByName("SpriteRender").depth + this.parent.depth;
        this.maxHealth = this.parent.healthMax;
        this.healthIncrement = this.parent.health;
    }
    Update() {
        if (this.healthIncrement !== this.parent.health)
            this.healthIncrement += (this.parent.health - this.healthIncrement) / 15;
        this.render();
    }
}