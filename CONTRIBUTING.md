# How to contribute

This is a very small project hence is not that difficult to contribute. The bulk of the code is in [index.js](./index.js). The preprocessor make use of `parse` from `svelte/compiler` to parse the code in an AST ([take a look at ast explorer](https://astexplorer.net)).

After the parsing it proceed to `walk` the instance (which is the script tag) taking notes of:

-   Every component that contains `.client.svelte` (the static import will also be changed into a dynamic one)
-   Every variable declaration that has an `init` of type `Identifier` (both the name of the declaration and of the `init` is stored)

It then proceed to add every variable name where the `init` is present to the `Set` of client components to the `Set` of client components (basically if you are declaring a variable with a client component it add that variable name to the list of client components).

Finally it `walk` the template (the html) and whenever encounter an `InlineComponent` with a name that is included in the list of client components it wrap that `InlineComponent` in the `await` block.

## How to write tests?

We use `vitest` to run our tests but we make use of `vite` `import.meta.glob` to read the expected input and output from the `tests` folder. If you check here you can see that every test is a folder with an `input.svelte` and an `output.svelte` inside. To add a new test just create a new folder with the appropriate files in it.

N.B. After you create a test you need to restart the test script.

## Before pushing

Before pushing make sure to run the script `test:ci` and make sure that either `eslint`, `prettier` and `vitest` are happy :smile:
