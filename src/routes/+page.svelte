<script lang="ts">
    import { onMount } from "svelte";
    import { main } from "../ant";
    import Tab from "../component/Tab.svelte";
    import Alert from "../component/Alert.svelte";
    import Stats from "../component/Stats.svelte";

    onMount(() => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("canvas") as CanvasRenderingContext2D;
        const gl2 = canvas.getContext("webgl2") as WebGL2RenderingContext;
        main(canvas, ctx, gl2)
    })
</script>

<div class="flex flex-col p-10">
    <div class="flex flex-row flex-wrap">
        <div class="flex flex-row">
            <canvas id="canvas" width="800" height="800"></canvas>
        </div>
        <div class="flex flex-col overflow-y-auto flex-grow ml-10 mr-10 p-1">
            <Stats/>
            <Tab/>
        </div>
    </div>
</div>
<Alert/>

<style>
    pre {
        outline: 1px solid black;
        background-color: lightgrey;
        max-width: 300px;
        max-height: 300px;
        overflow: auto;
        padding: 10px;
    }
</style>