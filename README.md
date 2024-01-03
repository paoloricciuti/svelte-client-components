# svelte-client-components

A preprocessor for svelte that allows you to annotate a component as a client component with the extension `.client.svelte`

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

![npm](https://img.shields.io/npm/v/svelte-client-components)

![npm](https://img.shields.io/npm/dt/svelte-client-components)

![GitHub last commit](https://img.shields.io/github/last-commit/paoloricciuti/svelte-client-components)

## Contributing

Contributions are always welcome!

If you want to start contributing take a look at [the contributions guidelines](./CONTRIBUTING.md), otherwise if you found a problem or have an idea feel free to [open an issue](https://github.com/paoloricciuti/svelte-client-components/issues/new)

If you want the fastest way to open a PR try out Codeflow

[![Open in Codeflow](https://developer.stackblitz.com/img/open_in_codeflow.svg)](https://pr.new/paoloricciuti/svelte-client-components/)

## Authors

-   [@paoloricciuti](https://www.github.com/paoloricciuti)

## Installation

Install svelte-client-components with pnpm (or npm, or yarn)

```bash
  pnpm install svelte-client-components@latest -D
```

## Usage

The only thing you have to do to use this preprocessor is add it to your `svelte.config.js`

```js
import adapter from '@sveltejs/adapter-static';
import { svelte_client_components } from 'svelte-client-components';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: svelte_client_components(),
	kit: {
		adapter: adapter(),
	},
};

export default config;
```

to annotate a component as a client component you can just use the extension `.client.svelte` (eg. `Button.client.svelte`).

## How it works

The preprocessor will be invoked before the svelte compiler and will change your code to prevent the component to be rendered during SSR. How? It make use of the fact that server svelte will not await Promises inside the `{#await}` block.

Whenever you will use a Component that has `.client.svelte` in the import path it will be wrapped in an `await` block with a `Promise.resolve()` promise. This will ensure the fastest mount of the Component as soon as JS is available. Let's see a simple example.

This code

```svelte
<script>
	import Test from './Test.client.svelte';
</script>

<Test />
```

will be preprocessed to become this

```svelte
<script>
	import Test from './Test.client.svelte';
</script>

{#await Promise.resolve() then}<Test />{/await}
```

## Gotcha's

As you have just read this preprocessor uses static analysis to do his job. This means that it has unfortunately some gotcha's. This is the cases that are currently tracked by the preprocessor

### Basic import

```svelte
<script>
	import Test from './Test.client.svelte';
</script>

<Test />
```

### Usage with `svelte:component`

```svelte
<script>
	import Test from './Test.client.svelte';
</script>

<svelte:component this={Test} />
```

N.b. this will only work if you use the actual imported component in the `this` attribute

### Reassignment to a `const` variable

```svelte
<script>
	import Test from './Test.client.svelte';

	const Test2 = Test;
</script>

<Test2 />
```
