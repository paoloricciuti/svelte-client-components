<script>
	import Test from './Test.client.svelte';
	import Test2 from './Test.svelte';
</script>

{#await Promise.resolve() then}<Test />{/await}

<Test2 />
