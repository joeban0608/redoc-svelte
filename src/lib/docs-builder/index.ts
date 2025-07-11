import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import path from 'path';
import fs from 'fs';
import { ORIGIN } from '$env/static/private';
import schema from '$lib/fetcher/schema';
import z from 'zod';

export class DocBuilder {
	private static readonly docConfig = {
		openApiVersion: '3.1.0',
		apiVersion: '1.0.0',
		title: 'XXX API Documentation'
	};

	static registry: OpenAPIRegistry = new OpenAPIRegistry();

	private static formatTags(path: string): string[] {
		const parts = path.split('/').filter(Boolean);
		return parts[0] === 'api' ? parts.slice(1) : parts;
	}

	static registerPathFromSchema(_schema: typeof schema): void {
		const apiKeyAuth = DocBuilder.registry.registerComponent('securitySchemes', 'ApiKeyAuth', {
			type: 'apiKey',
			in: 'header',
			name: 'X-API-Key'
		});
		Object.entries(_schema).forEach(([key, item]) => {
			const [method, path] = key.split(' ');
			const httpMethod = method.toLowerCase() as 'get' | 'post' | 'put' | 'delete';
			const tag = this.formatTags(path).join('-');

			const commonPathConfig = {
				method: httpMethod,
				path,
				summary: path,
				tags: [tag],
				description: item.description,
				security: [{ [apiKeyAuth.name]: [] }],
				responses: {
					200: {
						description: 'Success response',
						content: {
							'application/json': {
								schema: item.response
							}
						}
					},
					400: {
						description: 'Bad Request',
						content: {
							'application/json': {
								schema: z.object({
									code: z.number().describe('HTTP status code'),
									message: z.string().describe('Error message'),
									status: z.enum(['error', 'success']).describe('Status of the response')
								})
							}
						}
					},
					401: {
						description: 'Unauthorized',
						content: {
							'application/json': {
								schema: z.object({
									code: z.number().describe('HTTP status code'),
									message: z.string().describe('Error message'),
									status: z.enum(['error', 'success']).describe('Status of the response')
								})
							}
						}
					}
				}
			};

			if (method === 'GET') {
				this.registry.registerPath({
					...commonPathConfig,
					request: {
						params: item.request || undefined
					}
				});
			} else {
				this.registry.registerPath({
					...commonPathConfig,
					request: {
						body: {
							content: {
								'application/json': {
									schema: item.request
								}
							}
						}
					}
				});
			}
		});
	}

	private static generateDoc() {
		const generator = new OpenApiGeneratorV3(this.registry.definitions);

		return generator.generateDocument({
			openapi: this.docConfig.openApiVersion,
			info: {
				title: this.docConfig.title,
				version: this.docConfig.apiVersion
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
	}

	static writeDocToFile(): void {
		try {
			const doc = this.generateDoc();

			const destDir = path.join('static', 'docs', this.docConfig.apiVersion);
			if (!fs.existsSync(destDir)) {
				fs.mkdirSync(destDir, { recursive: true });
			}

			fs.writeFileSync(path.join(destDir, 'swagger.json'), JSON.stringify(doc, null, 2));
		} catch (error) {
			console.error('Failed to write OpenAPI document:', error);
			throw error;
		}
	}
}

export function docsBuilder(): void {
	DocBuilder.registerPathFromSchema(schema);
	DocBuilder.writeDocToFile();
}
