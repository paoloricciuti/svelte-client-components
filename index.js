import { parse } from 'svelte/compiler';
import { walk } from 'zimmerframe';
import MagicString from 'magic-string';

/**
 *
 * @param {MagicString} mstr
 * @param {number} start
 * @param {number} end
 */
function wrap(mstr, start, end) {
	const snip = mstr.snip(start, end).toString();
	mstr.overwrite(start, end, `{#await Promise.resolve() then}${snip}{/await}`);
}

/**
 *
 * @param {string} value
 * @returns
 */
function transform(value) {
	let new_val = new MagicString(value);
	const parsed = parse(value);
	const client_components = new Set();

	/**
	 * @typedef {typeof parsed} Ast
	 */
	if (parsed.instance?.content) {
		walk(
			/**@type {(Ast["instance"]&{})["content"]["body"][number]}*/ (
				/** @type {unknown} */
				(parsed.instance)
			),
			{},
			{
				ImportDeclaration(node) {
					const source = node?.source?.value;
					if (typeof source === 'string' && source.includes?.('.client.svelte')) {
						for (let imports of node.specifiers) {
							if (imports.type === 'ImportDefaultSpecifier') {
								client_components.add(imports.local.name);
							}
						}
					}
				},
			},
		);
		walk(
			parsed.html,
			{},
			{
				InlineComponent(node, { next }) {
					if (
						client_components.has(node.name) ||
						// account for svelte:component
						client_components.has(node.expression?.name)
					) {
						wrap(new_val, node.start, node.end);
					}
					next();
				},
			},
		);
		return { code: new_val.toString(), map: new_val.generateMap() };
	}
}

/**
 *
 * @returns {import("svelte/compiler").PreprocessorGroup}
 */
export function svelte_client_components() {
	return {
		markup({ content }) {
			return transform(content);
		},
	};
}
