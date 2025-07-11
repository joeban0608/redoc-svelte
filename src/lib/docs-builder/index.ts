import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import path from 'path';
import fs from 'fs';
import schema from '$lib/fetcher/schema';
import z from 'zod';
import { env } from '$env/dynamic/public';

export class DocBuilder {
	static readonly docConfig = {
		openApiVersion: '3.1.0',
		apiVersion: '1.0.0',
		title: 'API Documentation'
	};

	private static registry: OpenAPIRegistry = new OpenAPIRegistry();

	static tagGenerator(path: string): string {
		const parts = path.split('/').filter(Boolean);
		const formatParts = parts[0] === 'api' ? parts.slice(1) : parts;
		const upperCaseFormatParts = formatParts.map(
			(part) => part.charAt(0).toUpperCase() + part.slice(1)
		);

    // 針對不同的 path 格式進行處理
		const tag =
			upperCaseFormatParts[0] === 'Advertise'
				? `${upperCaseFormatParts[0]} ${upperCaseFormatParts[1]}`
				: upperCaseFormatParts[0];
		return tag;
	}

	static registerPathFromSchema(_schema: typeof schema): void {
		const apiKeyAuth = DocBuilder.registry.registerComponent('securitySchemes', 'ApiKeyAuth', {
			type: 'apiKey',
			in: 'header',
			name: 'X-API-Key'
		});
		// Define common error response schema once
		const errorResponseSchema = z.object({
			code: z.number().describe('HTTP status code'),
			message: z.string().describe('Error message'),
			status: z.enum(['error', 'success']).describe('Status of the response')
		});

		Object.entries(_schema).forEach(([key, item]) => {
			const [method, path] = key.split(' ');
			const httpMethod = method.toLowerCase() as 'get' | 'post' | 'put' | 'delete';

			const commonPathConfig = {
				method: httpMethod,
				path,
				tags: [DocBuilder.tagGenerator(path)],
				summary: item.name.replace(/([A-Z])/g, ' $1').trim(),
				description: item.description,
				security: [{ [apiKeyAuth.name]: [] }],
				responses: {
					200: {
						description: 'Success response',
						content: {
							'application/json': { schema: item.response }
						}
					},
					400: {
						description: 'Bad Request',
						content: { 'application/json': { schema: errorResponseSchema } }
					},
					401: {
						description: 'Unauthorized',
						content: { 'application/json': { schema: errorResponseSchema } }
					}
				}
			};

			// Register path based on method type
			this.registry.registerPath({
				...commonPathConfig,
				request:
					method === 'GET'
						? { params: item.request || undefined }
						: { body: { content: { 'application/json': { schema: item.request } } } }
			});
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
					url: `${env.PUBLIC_ORIGIN}`,
					description: 'host server'
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
