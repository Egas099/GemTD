class HealthBar extends MonoBehavior {
    constructor(_parent = GameObject) {
        super(_parent);
        this.className = "HealthBar";
        this.loadLines();
    }
    loadLines() {
        this.redLine = sprites.redPixel;
        this.greenLine = sprites.greenPixel;
    }
    render() {
        RenderInterface.drawImage(
            this.depth + 1,
            this.redLine,
            this.sx,
            this.sy,
            this.sWidth,
            this.sHeight,
            this.parent.position.x - this.parent.size.x / 2,
            this.parent.position.y - this.parent.size.y / 2,
            this.parent.size.x,
            this.parent.size.y / 10,
            );
        RenderInterface.drawImage(
            this.depth + 2,
            this.greenLine,
            this.sx,
            this.sy,
            this.sWidth,
            this.sHeight,
            this.parent.position.x - this.parent.size.x / 2,
            this.parent.position.y - this.parent.size.y / 2,
            this.parent.size.x / (this.maxHealth / this.parent.findComponentByName("EnemyController").health),
            this.parent.size.y / 10,
            );
    }
    Start() {
        this.depth = this.parent.findComponentByName("SpriteRender").depth  + this.parent.depth;
        this.maxHealth = this.parent.findComponentByName("EnemyController").maxHealth;
    }
    Update() {
        this.render();
    }
}
