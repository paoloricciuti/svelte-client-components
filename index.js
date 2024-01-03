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
	try {
		const snip = mstr.snip(start, end).toString();
		mstr.overwrite(start, end, `{#await Promise.resolve() then}${snip}{/await}`);
	} catch {}
}

/**
 *
 * @param {string} value
 * @returns
 */
function transform(value) {
	let new_val = new MagicString(value);
	const parsed = parse(value);
	/**
	 * @type {Set<string>}
	 */
	const client_components = new Set();
	/**
	 * @type {Map<string, string>}
	 */
	const variables = new Map();

	if (parsed.instance?.content) {
		walk(
			// this is to please ts, i think there's some problem with walk typing
			/**@type {import("estree").Node}*/ (
				/** @type {unknown} */
				(parsed.instance)
			),
			{},
			{
				VariableDeclaration(node) {
					for (let declaration of node.declarations) {
						if (declaration.init?.type === 'Identifier') {
							// only track the const declarations since let could be
							// reassigned with a non client component
							if (declaration.id.type === 'Identifier' && node.kind === 'const') {
								variables.set(declaration.id.name, declaration.init.name);
							}
						}
					}
				},
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
		for (const [variable_declaration, identifier] of variables.entries()) {
			if (client_components.has(identifier)) {
				client_components.add(variable_declaration);
			}
		}
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
	return;
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
