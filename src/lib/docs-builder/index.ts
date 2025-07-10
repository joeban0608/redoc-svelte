import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { TodoListRequestSchema, TodoListResponseSchema } from '$lib/fetcher/schema/todoSchema';
import path from 'path';
import fs from 'fs';

export async function docsBuilder() {
	const registry = new OpenAPIRegistry();
	// 1. 建立 registry 並註冊你的 endpoint

	registry.registerPath({
		method: 'post',
		path: '/todos',
		request: {
			body: {
				content: {
					'application/json': {
						schema: TodoListRequestSchema
					}
				}
			}
		},
		responses: {
			200: {
				description: 'Success',
				content: {
					'application/json': {
						schema: TodoListResponseSchema
					}
				}
			}
		}
	});

	// 2. 產生 OpenAPI 文件
	const generator = new OpenApiGeneratorV3(registry.definitions);
	const version = '1.0.0';

	const doc = generator.generateDocument({
		openapi: '3.1.0',
		info: {
			title: 'My API',
			version: version
		}
	});

	// 先確保目標資料夾存在
	const destDir = path.join('static', 'docs', version);
	if (!fs.existsSync(destDir)) {
		fs.mkdirSync(destDir, { recursive: true });
	}
	// 複製 swagger.json 檔案
	fs.writeFileSync(path.join(destDir, 'swagger.json'), JSON.stringify(doc, null, 2));
}
