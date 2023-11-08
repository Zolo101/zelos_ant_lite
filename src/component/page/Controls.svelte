<script lang="ts">
    import Game from "../../ant/game";

    $: controlText = Game.paused ? "Resume" : "Pause";
</script>

<div class="flex flex-row flex-wrap">
    <div class="w-full flex flex-row justify-evenly">
        <div class="button !py-5 !px-10 font-bold text-black text-opacity-75 !bg-green-200 hover:!bg-green-300" on:click={() => {
            Game.restart()
            Game.paused = false
        }}>Restart (R)</div>
        <div class="button !py-5 !px-10 font-bold text-black text-opacity-75 !bg-amber-200 hover:!bg-amber-300" on:click={() => Game.paused = !Game.paused}>{controlText} (P)</div>
        <div class="button !py-5 !px-10 font-bold text-black text-opacity-75 !bg-lime-200 hover:!bg-lime-300 once" on:click={() => Game.tick()}>One Tick</div>
        <input type="range" value="0" on:input={(event) => Game.iterationsPerTick = Math.floor(event.target.value ** 3.5)}>
    </div>
    <div class="flex flex-row flex-wrap w-1/2">
<!--        <p class="text-center">Tickspeed</p>-->
<!--        <div class="button once" on:click={() => Game.tick()}>One Tick</div>-->
<!--        <div class="button once" on:click={() => Game.iterationsPerTick = 1}>1 I/t</div>-->
<!--        <div class="button once" on:click={() => Game.iterationsPerTick = 10}>10 I/t</div>-->
<!--        <div class="button once" on:click={() => Game.iterationsPerTick = 100}>100 I/t</div>-->
<!--        <div class="button once" on:click={() => Game.iterationsPerTick = 1000}>1,000 I/t</div>-->
<!--        <div class="button once" on:click={() => Game.iterationsPerTick = 10000}>10,000 I/t</div>-->
<!--        <div class="button once" on:click={() => Game.iterationsPerTick = 100000}>100,000 I/t</div>-->
<!--        <div class="button once" on:click={() => Game.iterationsPerTick = 1000000}>1,000,000 I/t</div>-->
<!--        <div class="button once" on:click={() => Game.iterationsPerTick = 10000000}>10,000,000 I/t</div>-->
    </div>
</div>