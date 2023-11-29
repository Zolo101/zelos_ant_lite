import Ant from "./ant";
import Game from "./game";

class Board {
    width: number
    height: number
    cells: Uint8ClampedArray
    image: Uint8ClampedArray
    ants: Ant[]

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
        this.cells = new Uint8ClampedArray(width * height)
        this.image = new Uint8ClampedArray(3 * this.width * this.height)
        this.ants = []
        this.clear()
    }

    clear() {
        this.cells.fill(0);
        this.ants = []
    }

    getCell(x: number, y: number) {
        return this.cells[y * this.width + x]
    }

    setCell(x: number, y: number, value: number) {
        this.cells[y * this.width + x] = value
    }

    incrementCell(x: number, y: number) {
        const id = this.getCell(x, y)
        // id = (id + 1) & (Game.tiles.length - 1)
        this.setCell(x, y, (id < Game.tiles.length - 1) ? id + 1 : 0)
        // console.log(id, game.tiles.size, id < game.tiles.size - 1)

        return
    }

    addAnt(x: number, y: number) {
        this.ants.push(new Ant({ x, y }))
    }
}

export default Board;