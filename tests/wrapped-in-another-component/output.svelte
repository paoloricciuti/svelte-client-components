<script>
	import Test from './Test.client.svelte';
	import Test2 from './Test2.svelte';
</script>

<Test2>
	{#await Promise.resolve() then}<Test />{/await}
</Test2>
