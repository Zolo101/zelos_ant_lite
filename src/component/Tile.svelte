<script lang="ts">
    import Tile from "../ant/tile";

    export let tile: Tile;
    export let index: number;
    let rgbColor = `rgb(${tile.colour[0]},${tile.colour[1]},${tile.colour[2]})`
</script>

<div class="h-20 w-20 flex items-center justify-center p-5 outline" style="background-color: {rgbColor}">
    <span class="text-white text-3xl font-bold">{index}</span>
</div>

<style>
    span {
        -webkit-text-stroke: 1px black;
    }
</style>