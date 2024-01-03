<script>
	import Test from './Test.client.svelte';
</script>

{#await Promise.resolve() then}<Test />{/await}

{#await Promise.resolve() then}<svelte:component this={Test} />{/await}
