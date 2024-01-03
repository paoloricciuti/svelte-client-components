<script>
	import Test from './Test.client.svelte';

	let Test2;
	Test2 = Test;
</script>

<!-- svelte-ignore reactive-component -->
{#await Promise.resolve() then}<Test2 />{/await}

{#await Promise.resolve() then}<svelte:component this={Test2} />{/await}
