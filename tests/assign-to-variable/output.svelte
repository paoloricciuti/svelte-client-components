<script>
	const Test = import('./Test.client.svelte');

	const Test2 = Test;
</script>

{#await Test2 then { default: Test2 }}<Test2 />{/await}

{#await Test2 then { default: Test2 }}<svelte:component this={Test2} />{/await}
