// this is just here to please TS inside the svelte files
declare module './*.svelte' {
	import type { SvelteComponent, ComponentType } from 'svelte';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	declare const component: ComponentType<SvelteComponent<any, any, any>>;
	export default component;
}
