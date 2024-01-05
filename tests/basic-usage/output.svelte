<script>
	const Test = import('./Test.client.svelte');
</script>

{#await Test then { default: Test }}<Test />{/await}
