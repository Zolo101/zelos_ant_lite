import Board from "./board";
import Tile from "./tile";
import { writable } from "svelte/store";
import { canvas, iterate } from "./index";
import Ant from "./ant";

const left = (ant: Ant) => ant.turnLeft();
const right = (ant: Ant) => ant.turnRight();
const back = (ant: Ant) => ant.turnBack();
const north = (ant: Ant) => ant.rotation = 0;
const east = (ant: Ant) => ant.rotation = 1;
const south = (ant: Ant) => ant.rotation = 2;
const west = (ant: Ant) => ant.rotation = 3;


class Game {
    static width = 400;
    static height = 400;

    static board = new Board(Game.width, Game.height)
    static tiles: Tile[] = []
    // TODO: Necessary?
    static colours: Tile["colour"][] = []
    static tileTriggers = new Map<number, (ant: Ant) => void>()
    static onEachIteration: (ant: Ant) => void = (ant) => ant.moveForward();

    static alertText = writable("")
    static oldTiles: [number, number][] = []
    static updateInProgress: boolean = false


    static paused: boolean = false
    // static iterationsPerTick: number = 100
    static iterationsPerTick: number = 100000
    static iterations = 0
    static renderer: any;

    static restart() {
        Game.board.clear()
        Game.iterations = 0
        Game.board.addAnt(Game.board.width / 2, Game.board.height / 2);
    }

    static clear() {
        Game.board.clear()
        Game.colours = []
        Game.tiles = []
    }

    static takePicture() {
        Game.renderer.render();
        return canvas.toDataURL();
    }

    static tick() {
        Game.updateInProgress = true;

        for (let i = 0; i < Game.iterationsPerTick; i++) iterate()
        Game.iterations += Game.iterationsPerTick
        Game.renderer.updateTiles(Game.board.cells)

        Game.updateInProgress = false;
    }

    static addTile(color: Tile["colour"], trigger: Tile["trigger"]) {
        const newTile = new Tile(Game.tiles.length, color, trigger)
        let func;
        switch (trigger) {
            case "L": func = left; break;
            case "R": func = right; break;
            case "B": func = back; break;
            case "N": func = north; break;
            case "E": func = east; break;
            case "S": func = south; break;
            case "W": func = west; break;
            default:
                throw new Error("Invalid trigger")
        }
        Game.tileTriggers.set(Game.tiles.length, func)
        Game.tiles.push(newTile)
        Game.colours.push(newTile.colour)

        return newTile
    }
}

export default Game;