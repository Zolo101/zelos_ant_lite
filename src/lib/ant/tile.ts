class Tile {
    id: number
    colour: RGB
    // TODO: remove triggers
    trigger: string

    constructor(id: number, colour: Tile["colour"], trigger: string) {
        this.id = id
        this.colour = colour
        this.trigger = trigger
    }

    getRGB() {
        return `rgb(${this.colour[0]}, ${this.colour[1]}, ${this.colour[2]})`
    }
}

export default Tile;
