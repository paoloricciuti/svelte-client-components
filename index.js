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
	const variable_declarations = new Map();

	/**
	 * @typedef {typeof parsed} Ast
	 */
	if (parsed.instance?.content) {
		walk(
			// this is to please ts, i think there's some problem with walk typing
			/**@type {(Ast["instance"]&{})["content"]["body"][number]}*/ (
				/** @type {unknown} */
				(parsed.instance)
			),
			{},
			{
				VariableDeclaration(node) {
					for (let declaration of node.declarations) {
						if (declaration.init?.type === 'Identifier') {
							if (declaration.id.type === 'Identifier') {
								variable_declarations.set(
									declaration.id.name,
									declaration.init.name,
								);
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
		for (const [variable_declaration, identifier] of variable_declarations.entries()) {
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
