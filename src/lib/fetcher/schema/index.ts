import { todoSchema } from './todoSchema';

const schema = {
	...todoSchema
} as const;
export default schema;
