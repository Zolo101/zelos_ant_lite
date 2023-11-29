import Game from "./game";
import Renderer from "./render/webgl2";

export let canvas: HTMLCanvasElement;
export let ctx: CanvasRenderingContext2D;
export let gl2: WebGL2RenderingContext;
export let newTileEvent = new Event("newTile");
// TODO: Temporary
export let updateTileEvent = new Event("updateTile");
export let renderer: Renderer;

export function main(gl2_2D: WebGL2RenderingContext) {
    gl2 = gl2_2D
    renderer = new Renderer(gl2)
    return renderer;
}

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