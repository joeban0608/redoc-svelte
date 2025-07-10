import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { todoSchema } from './todoSchema';
import z from 'zod';
extendZodWithOpenApi(z);

const schema = {
	...todoSchema
} as const;
export default schema;
