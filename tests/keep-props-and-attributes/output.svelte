<script>
	import Test from './Test.client.svelte';

	let prop_3 = '';
	let prop_four = '';
</script>

{#await Promise.resolve() then}<Test prop_one="" prop_2={true} {prop_3} prop_4={prop_four} />{/await}
