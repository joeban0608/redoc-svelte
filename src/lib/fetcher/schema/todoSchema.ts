import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import z from 'zod';
extendZodWithOpenApi(z);

export const TodoListRequestSchema = z
	.object({
		page: z
			.union([z.string().regex(/^\d+$/), z.number().int()])
			.transform((val) => Number(val))
			.refine((val) => val > 0, {
				message: 'Page number must be greater than 0'
			})
			.optional()
			.describe('The page number for pagination, optional. Must be greater than 0.'),
		limit: z
			.union([z.string().regex(/^\d+$/), z.number().int()])
			.transform((val) => Number(val))
			.refine((val) => val > 0 && val <= 100, {
				message: 'Limit must be between 1 and 100'
			})
			.optional()
			.describe('The maximum number of items per page, optional. Min: 1, Max: 100 (default: 25)')
	})
	.openapi('TodoListRequest');

export const TodoListResponseSchema = z
	.object({
		pagination: z.object({
			page: z.number().describe('The current page number.'),
			limit: z.number().describe('The number of items per page.'),
			total: z.number().describe('The total number of items.')
		}),
		items: z.array(
			z.object({
				id: z.string(),
				title: z.string(),
				createdAt: z.date(),
				updatedAt: z.date()
			})
		)
	})
	.openapi('TodoListResponse');

export const todoSchema = {
	'GET /api/todos': {
		tooling: true,
		name: 'getTodos',
		description: 'Fetches a specific site by its unique identifier.',
		request: TodoListRequestSchema,
		response: TodoListResponseSchema
	},
	'POST /api/todo': {
		tooling: true,
		name: 'createTodo',
		description: 'Creates a new todo item.',
		request: z.object({
			title: z.string().min(1, 'Title is required')
		}),
		response: z.object({
			id: z.string(),
			title: z.string(),
			createdAt: z.date(),
			updatedAt: z.date()
		})
	},
	'PUT /api/todo': {
		tooling: true,
		name: 'updateTodo',
		description: 'Updates an existing todo item.',
		request: z.object({
			id: z.string(),
			title: z.string().min(1, 'Title is required')
		}),
		response: z.object({
			id: z.string(),
			title: z.string(),
			createdAt: z.date(),
			updatedAt: z.date()
		})
	},
	'DELETE /api/todo': {
		tooling: true,
		name: 'deleteTodo',
		description: 'Deletes a todo item by its unique identifier.',
		request: z.object({
			id: z.string()
		}),
		response: z.object({
			message: z.string().optional()
		})
	}
};
