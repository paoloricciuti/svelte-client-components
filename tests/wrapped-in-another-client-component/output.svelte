<script>
	const Test = import('./Test.client.svelte');
	const Test2 = import('./Test2.client.svelte');
</script>

{#await Test2 then { default: Test2 }}<Test2>
	{#await Test then { default: Test }}<Test />{/await}
</Test2>{/await}
