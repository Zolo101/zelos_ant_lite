import Game from "./game";
import Renderer from "./render/webgl2/webgl2";
import WebGPURenderer from "./render/webgpu/webgpu";

export let canvas: HTMLCanvasElement;
export let ctx: CanvasRenderingContext2D;
export let gl2: WebGL2RenderingContext;
export let glw: GPUCanvasContext;
export let newTileEvent = new Event("newTile");
// TODO: Temporary
export let updateTileEvent = new Event("updateTile");
export let renderer: Renderer | WebGPURenderer;

export async function main(gl2_2D: WebGL2RenderingContext | null, glw_2D: GPUCanvasContext | null): Promise<Renderer | WebGPURenderer> {
    // console.log("webgl2:", !!gl2_2D, "webgpu:", !!glw_2D)
    if (glw_2D) {
        const adapter = await navigator.gpu?.requestAdapter();
        if (!adapter) {
            alert("WebGPU is not supported");
            throw new Error("WebGPU is not supported")
        }

        const device = await adapter?.requestDevice();
        if (!device) {
            alert("WebGPU is not supported");
            throw new Error("WebGPU is not supported")
        }

        glw = glw_2D
        renderer = new WebGPURenderer(glw, adapter, device);
        return renderer;
    }

    if (gl2_2D) {
        gl2 = gl2_2D
        renderer = new Renderer(gl2);
        return renderer;
    }

    alert("No WebGL2 or WebGPU support!")
    throw new Error("No WebGL2 or WebGPU support!")
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