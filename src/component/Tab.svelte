<script lang="ts">
    import Tiles from "./page/Tiles.svelte";
    import Controls from "./page/Controls.svelte";
    import Credits from "./page/Credits.svelte";
    import Saves from "./page/Saves.svelte";

    let page = 0;
</script>

<div class="flex flex-row">
    <p on:click={() => page = 0}>Editor</p>
    <p on:click={() => page = 1}>Tiles</p>
    <p on:click={() => page = 2}>Saves</p>
<!--    <p on:click={() => page = 3}>Settings</p>-->
    <p on:click={() => page = 4}>About</p>
<!--    <p class="button" on:click={() => page = 5}>Debug</p>-->
</div>
<div>
        <div class:hidden={page !== 0} class="outline outline-1 outline-black" id="blockly" style="width: 1000px; height: 800px"></div>
        <div class:hidden={page !== 1}><Tiles/></div>
        <div class:hidden={page !== 2}><Saves/></div>
        <div class:hidden={page !== 3}><Controls/></div>
        <div class:hidden={page !== 4}><Credits/></div>
<!--        <div class:hidden={page !== 5}><pre id="code"></pre></div>-->
</div>

<style>
    p {
        @apply cursor-pointer font-bold bg-gray-300 rounded shadow-lg py-2 px-6 m-2 transition-colors;
    }

    p:hover {
        @apply bg-gray-400;
    }
</style>