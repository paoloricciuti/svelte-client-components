/// <reference types="vite/client" />

import { dirname } from 'path';
import { preprocess } from 'svelte/compiler';
import { describe, expect, test } from 'vitest';
import { svelte_client_components } from './index.js';

const preprocessor = svelte_client_components();

type TestMapping = { expected: string; component: string; test: string };

const tests = new Map<string, TestMapping>();

Object.entries(
	import.meta.glob('./tests/*/*', {
		eager: true,
		as: 'raw',
	}),
).forEach(([filename, content]) => {
	const dir = dirname(filename).split('/').pop()!;
	const expected: keyof TestMapping =
		filename.split('/').pop() === 'output.svelte' ? 'expected' : 'component';
	if (!tests.has(dir)) {
		tests.set(dir, {
			component: '',
			expected: '',
			test: dir,
		});
	}
	tests.get(dir)![expected] = content.trim();
});

describe('preprocessor', () => {
	test.each([...tests.values()])('$test', async ({ component, expected }) => {
		try {
			const result = await preprocess(component, preprocessor);
			expect(result.code).toBe(expected);
		} catch (e) {
			// if there's no expected output the error should be there
			if (expected) {
				throw e;
			}
		}
	});
});
