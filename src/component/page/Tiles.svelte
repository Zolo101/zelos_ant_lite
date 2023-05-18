<script lang="ts">
    import Game from "../../ant/game";
    import Tile from "../Tile.svelte";
    import { newTileEvent, renderer, updateTileEvent } from "../../ant";
    import { onMount } from "svelte"

    const randomColour = () => [~~(Math.random()*255),~~(Math.random()*255),~~(Math.random()*255)]

    let x;
    const addTile = () => {
        Game.addTile(randomColour(), ["turn left"]);
        window.dispatchEvent(updateTileEvent)
        window.dispatchEvent(newTileEvent)
        Game.restart();
    };

    const editTile = (index: number, colour: unknown) => {

    }

    const removeTile = (index: number) => {
        // Must be at least one tile
        if (Game.tiles.length - 1 === 0) return;

        Game.tiles.splice(index, 1)
        Game.colours.splice(index, 1)
        selectedTileIndex = -1
        // tiles1 = Array.from(Game.tiles.values());
        window.dispatchEvent(updateTileEvent)
        renderer.updateColours()
        Game.restart();
    };

    const hexToRGB = (hex: string) => {
        const int = parseInt(hex.replace("#", ""), 16);
        const r = (int >> 16) & 255;
        const g = (int >> 8) & 255;
        const b = int & 255;

        return [r, g, b];
    }

    const RGBToHex = (rgb: [number, number, number]) => {
        return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)
    }

    // TODO: Temporary
    window.addEventListener("updateTile", () =>  x = (x + 1) & 3)


    onMount(() => {
        window.dispatchEvent(updateTileEvent)
        // const input
    })

    let selectedTileIndex: number = -1;
</script>

<div class="tiles items-center">
    {#key x}
        {#each Game.tiles as tile, index}
            <div
                    on:click={() => selectedTileIndex = index}
                    class="flex flex-row m-2.5 items-center shadow-2xl cursor-pointer hover:scale-110 transition-transform">
<!--                <div class="remove" on:click={() => removeTile(index)}>X</div>-->
<!--                <input type="color" id/>️️-->
<!--                <div class="edit" on:click={() => editTile(index)}>-->
<!--                </div>-->
                <Tile {tile} {index}/>
            </div>
<!--            <Line/>-->
        {/each}
    {/key}
</div>
<div class="add" on:click={() => addTile()}>+</div>

{#if selectedTileIndex >= 0}
    {@const selectedTile = Game.tiles[selectedTileIndex]}
    <div class="flex items-start gap-2">
<!--        <div>-->
<!--            <div class="text-2xl font-bold">Remove</div>-->
<!--            <div class="remove" on:click={() => selectedTile = null}>X</div>-->
<!--        </div>-->

        <div class="bg-gray-300 shadow rounded p-10">
            <div class="text-xl font-bold">Colour</div>
            <input
                    autocomplete
                    class="!w-32 !h-32"
                    type="color"
                    value={RGBToHex(selectedTile.colour)}
                    on:input={(e) => {
                const colour = hexToRGB(e.target.value)
                Game.tiles[selectedTileIndex].colour = colour
                Game.colours[selectedTileIndex] = colour
                window.dispatchEvent(updateTileEvent)
                renderer.updateColours()
            }}/>
        </div>

        <div
                class="button text-xl font-bold !bg-red-300 hover:!bg-red-500 transition-colors shadow rounded p-10"
                on:click={() => removeTile(selectedTileIndex)}
        >Remove?</div>
    </div>
{/if}

<style>
    .tiles {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        height: 400px;
        max-width: 800px;
        max-height: 400px;
        overflow: auto;
        background-color: #bbb;
    }

    .add {
        padding: 5px 10px;

        font-weight: bold;
        text-align: center;
        background-color: #ddd;
        outline: 1px solid black;
        max-width: 800px;
        cursor: pointer;
    }

    .add:hover {
        background-color: #ccc;
    }

    .remove {
        display: inline;
        position: relative;
        top: 20px;
        left: 44px;
        padding: 2px 4px;

        /*font-weight: bold;*/
        text-align: center;
        background-color: rgba(219, 112, 147, 0.75);
        outline: 1px solid red;
        cursor: pointer;
    }

    .edit {
        display: inline;
        position: relative;
        top: 20px;
        left: 61px;
        padding: 1px 2px;

        /*font-weight: bold;*/
        text-align: center;
        background-color: rgba(112, 219, 187, 0.75);
        outline: 1px solid cyan;
        cursor: pointer;
    }

    input {
        width: 32px;
        height: 32px;
        cursor: pointer;
        box-sizing: content-box;
        background-color: transparent;
        border: none;
        padding: 1px 2px;
    }
</style>