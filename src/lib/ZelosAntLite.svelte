<script lang="ts">
    import { onMount } from "svelte";
    import Stats from "./Stats.svelte";
    import Game from "$lib/ant/game";
    import Tile from "$lib/ant/tile";
    import { main } from "$lib/ant";

    const choose = <T>(choices: T[]) => choices[~~(Math.random() * choices.length)]
    $: x = [] as Array<Tile>;
    const chooseRGB = (): RGB => [~~(Math.random() * 255), ~~(Math.random() * 255), ~~(Math.random() * 255)]
    const chooseFarAwayRGB = (): [RGB, RGB] => {
        let a, b;
        while (RGBDistance(a = chooseRGB(), b = chooseRGB()) < 200) {}
        // let i = 0
        // while (RGBDistance(a = chooseRGB(), b = chooseRGB()) < 200) {i++}
        // console.log(i)
        return [a, b]
    }
    const RGBDistance = (a: RGB, b: RGB) => {
        const [r1, g1, b1] = a
        const [r2, g2, b2] = b
        return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)
    }
    const createGradient = (a: RGB, b: RGB, steps: number) => {
        const gradient: RGB[] = []
        for (let i = 0; i < steps; i++) {
            gradient.push([
                a[0] + (b[0] - a[0]) * i / steps,
                a[1] + (b[1] - a[1]) * i / steps,
                a[2] + (b[2] - a[2]) * i / steps,
            ])
        }
        return gradient
    }

    const calculateAutoIteration = (tiles: number) => tiles * (100000 / 256)
    const calculateIteration = (slider: number) => iterationSlider ** 2.5
    let newButton: () => void;
    let restartButton: () => void;
    let pureButton: () => void;
    let importSaveButton: () => void;
    let importRulesButton: () => void;
    let changeIteration: () => void;
    let copyButton: () => void;
    let PureMode = true;
    let dialog: HTMLDialogElement;
    $: tiles = 256;
    $: iterationSlider = 0;
    $: iterations = 0;

    onMount(() => {
        dialog = document.querySelector("#help") as HTMLDialogElement;
        const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
        // const ctx = canvas.getContext("canvas") as CanvasRenderingContext2D;
        const gl2 = canvas.getContext("webgl2") as WebGL2RenderingContext;
        const renderer = main(gl2)

        const generate = (save?: Save) => {
            Game.clear();
            // console.log(Game.iterationsPerTick)
            // const tiles = ~~(Math.random() * 250) + 4
            // Game.addTile([255, 255, 255], "L");
            // const half = ~~(tiles / 2)
            // const colours = [...createGradient(a, b, half), ...createGradient(b, a, half)]
            if (save) {
                // if its zero then calculate it
                Game.iterationsPerTick = iterations ? iterations : calculateAutoIteration(save.rules.length)
                const [a, b] = [save.gradient[0], save.gradient[1]]
                const colours = createGradient(a, b, save.rules.length)
                for (let i = 0; i < save.rules.length; i++) {
                    Game.addTile(colours[i], save.rules[i]);
                }
            } else {
                // if its zero then calculate it
                Game.iterationsPerTick = iterations ? iterations : calculateAutoIteration(tiles)
                console.log(Game.iterationsPerTick)
                const [a, b] = chooseFarAwayRGB()
                const colours = createGradient(a, b, tiles)
                for (let i = 0; i < tiles; i++) {
                    let choice = PureMode ? choose(["L", "R", "B", "N", "E", "W", "S"]) : choose(["L", "R"])
                    Game.addTile(colours[i], choice);
                }
            }
            renderer.updateColours()
            x = Game.tiles
            Game.board.addAnt(Game.board.width / 2, Game.board.height / 2);
        }
        // console.log(Game.tiles, Game.tileTriggers, Game.board.ants)

        window.addEventListener("keydown", (e: KeyboardEvent) => {
            switch (e.code) {
                case "KeyR":
                    Game.restart()
                    break;

                case "KeyN":
                    generate()
                    break;

                // case "KeyP":
                //     Game.paused = !Game.paused
                //     break;
            }
        })
        window.requestAnimationFrame(frame)

        function frame() {
            if (!Game.updateInProgress && !Game.paused) Game.tick();
            renderer.render();

            window.requestAnimationFrame(frame)
        }

        newButton = () => {
            generate()
            // dialog.close()
        }

        restartButton = () => {
            Game.restart()
            // dialog.close()
        }

        pureButton = () => {
            PureMode = !PureMode
        }

        copyButton = () => {
            const save = {
                gradient: [Game.tiles[0].colour, Game.tiles[Game.tiles.length - 1].colour],
                rules: Game.tiles.map(tile => tile.trigger).join("")
            }
            const encodedSave = window.btoa(JSON.stringify(save))
            navigator.clipboard.writeText(encodedSave)
        }

        importSaveButton = () => {
            try {
                const response = prompt("Enter save:")
                if (!response) return

                const save: Save = JSON.parse(window.atob(response))
                if (save.rules.length < 2) return alert("Rule string must be at least 2 characters long")
                if (save.rules.length > 256) return alert("Rule string must be at most 256 characters long")
                generate(save)
            } catch (e) {
                return alert("Invalid save")
            }
        }

        importRulesButton = () => {
            try {
                const response = prompt("Enter rules:")
                if (!response) return

                if (response.length < 2) return alert("Rule string must be at least 2 characters long")
                if (response.length > 256) return alert("Rule string must be at most 256 characters long")

                const save = {
                    gradient: chooseFarAwayRGB(),
                    rules: response
                }

                generate(save)
            } catch (e) {
                return alert("Invalid rules")
            }
        }

        changeIteration = () => {
            iterations = Math.floor(iterationSlider ? calculateIteration(iterationSlider) : calculateAutoIteration(tiles))
            Game.iterationsPerTick = iterations
        }

        generate()
    })
</script>
<dialog id="help" class="max-md:bg-white/40 max-md:w-fit md:p-5 overflow-y-auto overscroll-y-contain outline-4 outline-black drop-shadow-lg rounded max-md:m-0">
    <!--    <p>zelo's ant lite</p>-->
    <form method="dialog">
        <button class="font-bold float-right outline-red-800 bg-red-400 mb-3">Close</button>
    </form>
    <!--    create table of langtons ant characters and their turns -->
    <div class="w-fit flex max-md:flex-col md:max-w-[987px] gap-1">
        <div class="w-1/3">
            <table class="w-full max-md:w-[160px]">
                <!--            <thead>-->
                <!--                <tr>-->
                <!--                    <th></th>-->
                <!--                    <th>Meaning</th>-->
                <!--                </tr>-->
                <!--            </thead>-->
                <tbody>
                <tr>
                    <td>L</td>
                    <td>Turn left</td>
                </tr>
                <tr>
                    <td>R</td>
                    <td>Turn right</td>
                </tr>
                {#if PureMode}
                    <tr>
                        <td>B</td>
                        <td>Turn back</td>
                    </tr>
                    <tr>
                        <td>N</td>
                        <td>Set north</td>
                    </tr>
                    <tr>
                        <td>E</td>
                        <td>Set east</td>
                    </tr>
                    <tr>
                        <td>W</td>
                        <td>Set west</td>
                    </tr>
                    <tr>
                        <td>S</td>
                        <td>Set south</td>
                    </tr>
                {/if}
                </tbody>
            </table>
            <button class="outline-lime-800 bg-lime-400" on:click={copyButton}>Copy Save</button>
            <button class="outline-green-800 bg-green-400" on:click={importSaveButton}>Load Save</button>
            <button class="outline-neutral-600 bg-neutral-200" on:click={importRulesButton}>Set Rules</button>
            <button class="outline-neutral-600 bg-neutral-200" on:click={pureButton}>Pure Langton Mode ({PureMode ? "OFF": "ON"})</button>
            <span class="relative font-bold top-2">{tiles.toLocaleString()}</span>
            <span class="relative top-2">Rules</span>
            <input class="w-full h-2 m-0 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" bind:value={tiles} type="range" min="2" max="256" step="1"/>
            <span class="relative font-bold top-2">{iterationSlider ? iterations.toLocaleString() : "AUTO"}</span>
            <span class="relative top-2">Iterations per frame</span>
            <input class="w-full h-2 m-0 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" bind:value={iterationSlider} on:input={changeIteration} type="range" min="0" max="100" step="1"/>
<!--            <table class="w-full max-md:w-[160px] mt-2 text-center font-bold">-->
<!--                <tbody>-->
<!--                    <tr>-->
<!--                        <td>(N)ew</td>-->
<!--                        <td>(R)estart</td>-->
<!--                    </tr>-->
<!--                </tbody>-->
<!--            </table>-->
        </div>
        <div class="w-2/3 max-lg:max-w-full">
            <Stats tiles={x}/>
        </div>
    </div>
    <!--    <div class="flex gap-4">-->
    <!--        <button class="outline-teal-800 bg-teal-400" on:click={newButton}>(N)ew</button>-->
    <!--        <button class="outline-amber-800 bg-amber-400" on:click={restartButton}>(R)estart</button>-->
    <!--    </div>-->
</dialog>
<div class="flex flex-col w-[400px] gap-1">
    <canvas id="canvas" width="400" height="400"></canvas>
    <div class="flex justify-between text-xs">
        <span>zelo's ant lite</span>
        <span class="cursor-pointer hover:underline" on:click={newButton}>[new]</span>
        <span class="cursor-pointer hover:underline" on:click={restartButton}>[restart]</span>
        <span class="cursor-pointer hover:underline" on:click={() => dialog.showModal()}>[options]</span>
    </div>
</div>

<style>
    button {
        @apply text-xl w-full outline outline-2 py-1 rounded shadow mt-4 transition-all;
    }

    button:hover {
        @apply brightness-90;
    }

    pre {
        outline: 1px solid black;
        background-color: lightgrey;
        max-width: 300px;
        max-height: 300px;
        overflow: auto;
        padding: 10px;
    }

    img {
        image-rendering: pixelated;
        @apply pb-5;
    }

    table {
        @apply outline outline-2 outline-black/50 rounded border-hidden;
    }

    th, td {
        @apply p-2.5 border-2 border-neutral-400;
    }

    th {
        @apply bg-neutral-300;
        /*background-color: #5a5a5a;*/
    }

    td {
        @apply bg-neutral-200;
    }
</style>