<script lang="ts">
    import Game from "../ant/game";

    let show = false;
    let text = Game.alertText;
    text.subscribe((v) => show = !!v)

    const close = () => {
        show = false
        text.set("");
    }
</script>

<div class="absolute top-0 left-0 w-full h-full z-10 bg-black" class:hidden={!show}></div>
<div class="absolute outline outline-1 outline-black p-10 top-1/2 left-1/2 w-2/6 z-10 bg-gray-400" class:hidden={!show}>
    <p class="text-center h-4/5">{$text}</p>
    <p class="text-center button" on:click={() => close()}>OK!</p>
</div>