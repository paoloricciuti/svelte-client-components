<script>
	import Test from './Test.client.svelte';
	import Test2 from './Test2.client.svelte';
</script>

{#await Promise.resolve() then}<Test2>
	<Test />
</Test2>{/await}
