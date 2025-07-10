import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import path from 'path';
import fs from 'fs';
import { ORIGIN } from '$env/static/private';
import schema from '$lib/fetcher/schema';

let registry: OpenAPIRegistry | null = null;
export class DocBuilder {
	static version: string = '1.0.0';
	static get registry() {
		if (!registry) {
			registry = new OpenAPIRegistry();
			return registry;
		}
		return registry;
	}

	static init() {
		if (!registry) {
			registry = new OpenAPIRegistry();
		}
	}

	static generatorDoc() {
		if (!registry) {
			throw new Error('Registry is not initialized');
		}
		const generator = new OpenApiGeneratorV3(registry.definitions);
		const version = '1.0.0';

		const doc = generator.generateDocument({
			openapi: '3.1.0',
			info: {
				title: 'My API',
				version: version
			},
			servers: [
				{
					url: `${ORIGIN}/api`,
					description: 'host server'
				},
				{
					url: `http://localhost:5173/api`,
					description: 'Local development server'
				}
			]
		});
		return doc;
	}

	static writeDocToFile() {
		let doc = null;
		doc = DocBuilder.generatorDoc();
		if (!doc) {
			throw new Error('Failed to generate OpenAPI document');
		}

		const destDir = path.join('static', 'docs', DocBuilder.version);
		if (!fs.existsSync(destDir)) {
			fs.mkdirSync(destDir, { recursive: true });
		}
		fs.writeFileSync(path.join(destDir, 'swagger.json'), JSON.stringify(doc, null, 2));
	}
	// 這裡可以添加其他方法來處理文檔生成邏輯
}
export async function docsBuilder() {
	function formatTags(path: string) {
		const parts = path.split('/').filter(Boolean);
		return parts[0] === 'api' ? parts.slice(1) : parts;
	}
	DocBuilder.init();

	Object.entries(schema).forEach(([key, item]) => {
		const [method, path] = key.split(' ');
		if (method === 'GET') {
			DocBuilder.registry.registerPath({
				method: method.toLowerCase() as 'get' | 'post' | 'put' | 'delete',
				path: path,
				summary: path,
				tags: formatTags(path),
				description: item.description,
				request: {
					params: item.request ? item.request : undefined
				},
				responses: {
					200: {
						description: 'Success response',
						content: {
							'application/json': {
								schema: item.response
							}
						}
					}
				}
			});
		} else {
			DocBuilder.registry.registerPath({
				method: method.toLowerCase() as 'get' | 'post' | 'put' | 'delete',
				path: path,
				summary: path,
				tags: formatTags(path),
				description: item.description,
				request: {
					body: {
						content: {
							'application/json': {
								schema: item.request
							}
						}
					}
				},
				responses: {
					200: {
						description: 'Success response',
						content: {
							'application/json': {
								schema: item.response
							}
						}
					}
				}
			});
		}
	});

	DocBuilder.writeDocToFile();
}
