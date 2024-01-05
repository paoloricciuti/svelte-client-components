<script>
	const Test = import('./Test.client.svelte');
	import Test2 from './Test.svelte';
</script>

{#await Test then { default: Test }}<Test />{/await}

<Test2 />
