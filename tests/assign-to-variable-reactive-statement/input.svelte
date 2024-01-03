<script>
	import Test from './Test.client.svelte';

	let Test2;
	Test2 = Test;
</script>

<!-- svelte-ignore reactive-component -->
<Test2 />

<svelte:component this={Test2} />
