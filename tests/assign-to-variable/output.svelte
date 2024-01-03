<script>
	import Test from './Test.client.svelte';

	const Test2 = Test;
</script>

{#await Promise.resolve() then}<Test2 />{/await}
