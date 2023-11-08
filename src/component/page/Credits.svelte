<script lang="ts">
    import Link from "../Link.svelte";
</script>

<div class="credits">
<!--  TODO: Changelog  -->
    <p class="credit">Made by Zelo101, version 1.2.0. Check out the <Link href="https://github.com/Zolo101/zelos_ant">Source Code</Link>!</p>
    <p>Libraries used:</p>
    <ul>
        <li><Link href="https://twgljs.org/">TWGL</Link></li>
        <li><Link href="https://ramdajs.com/">Ramda</Link></li>
        <li><Link href="https://dexie.org/">Dexie</Link></li>
        <li><Link href="https://developers.google.com/blockly">Blockly</Link></li>
<!--        <li><Link href="https://www.assemblyscript.org/">AssemblyScript</Link></li>-->
        <li><Link href="https://kit.svelte.dev/">SvelteKit</Link></li>
    </ul>
</div>

<style>
    li, .credit {
        font-weight: bold;
    }
</style>