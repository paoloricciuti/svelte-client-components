<script>
	import Test from './Test.client.svelte';
</script>

{#await Promise.resolve() then}<Test />{/await}
