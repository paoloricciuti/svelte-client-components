<script>
	import Test from './Test.client.svelte';

	const Test2 = Test;
</script>

<Test2 />

<svelte:component this={Test2} />
