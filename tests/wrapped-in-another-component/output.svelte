<script>
	const Test = import('./Test.client.svelte');
	import Test2 from './Test2.svelte';
</script>

<Test2>
	{#await Test then { default: Test }}<Test />{/await}
</Test2>
