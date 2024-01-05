<script>
	const Test = import('./Test.client.svelte');

	let prop_3 = '';
	let prop_four = '';
</script>

{#await Test then { default: Test }}<Test prop_one="" prop_2={true} {prop_3} prop_4={prop_four} />{/await}
