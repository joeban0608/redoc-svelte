import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import path from 'path';
import fs from 'fs';
import { ORIGIN } from '$env/static/private';
import schema from '$lib/fetcher/schema';

let registry: OpenAPIRegistry | null = null;
export class DocBuilder {
	private static openApiVersion: string = '3.1.0';
	private static apiVersion: string = '1.0.0';

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

	private static formatTags(path: string) {
		const parts = path.split('/').filter(Boolean);
		return parts[0] === 'api' ? parts.slice(1) : parts;
	}
	static registerPath(_schema: typeof schema) {
		Object.entries(_schema).forEach(([key, item]) => {
			const [method, path] = key.split(' ');
			if (method === 'GET') {
				DocBuilder.registry.registerPath({
					method: method.toLowerCase() as 'get' | 'post' | 'put' | 'delete',
					path: path,
					summary: path,
					tags: [this.formatTags(path).join('-')],
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
					tags: [this.formatTags(path).join('-')],
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
	}

	private static generatorDoc() {
		if (!registry) {
			throw new Error('Registry is not initialized');
		}
		const generator = new OpenApiGeneratorV3(registry.definitions);

		const doc = generator.generateDocument({
			openapi: this.openApiVersion,
			info: {
				title: 'My API',
				version: this.apiVersion
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
		doc = this.generatorDoc();
		if (!doc) {
			throw new Error('Failed to generate OpenAPI document');
		}

		const destDir = path.join('static', 'docs', this.apiVersion);
		if (!fs.existsSync(destDir)) {
			fs.mkdirSync(destDir, { recursive: true });
		}
		fs.writeFileSync(path.join(destDir, 'swagger.json'), JSON.stringify(doc, null, 2));
	}
}
export async function docsBuilder() {
	await DocBuilder.init();

	await DocBuilder.registerPath(schema);

	await DocBuilder.writeDocToFile();
}
