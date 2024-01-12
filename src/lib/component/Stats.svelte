<script lang="ts">
    import Tile from "../ant/tile";

    export let tiles: Tile[];

    const colorBasedOnBackground = (rgb: RGBA) => {
        const yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
        return (yiq >= 128) ? "black" : "white";
    }
</script>

<p class="font-bold text-2xl text-center">Rules</p>
<div class="flex flex-wrap justify-center content-start overflow-y-auto h-[50vh] gap-1.5 p-2">
    {#each tiles as tile}
        <div class="flex justify-center items-center font-bold w-8 h-8 outline outline-2 outline-black text-white text-xl" style="background-color: {tile.getRGB()}">
            <p style="color: {colorBasedOnBackground(tile.colour)}">{tile.trigger}</p>
<!--            <span class="relative inline w-0 h-0 text-right -left-[20px] -top-[12px] text-[0.5em] invert contrast-[1e2] grayscale">{i}</span>-->
        </div>
    {/each}
</div>