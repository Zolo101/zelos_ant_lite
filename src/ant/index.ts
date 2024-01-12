import Game from "./game";

export let canvas: HTMLCanvasElement;
export let newTileEvent = new Event("newTile");
// TODO: Temporary
export let updateTileEvent = new Event("updateTile");

export function iterate() {
    for (const ant of Game.board.ants) {
        // Move
        const oldPos = ant.position
        Game.onEachIteration(ant)

        const cell = Game.board.getCell(ant.position.x, ant.position.y)
        // console.log(cell)
        const func = Game.tileTriggers.get(cell);
        if (func) func(ant);

        Game.board.incrementCell(oldPos.x, oldPos.y)
    }
}