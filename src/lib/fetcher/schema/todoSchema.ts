import z from 'zod';
export const todoSchema = {
	'GET /api/todos': {
		tooling: true,
		name: 'getTodos',
		description: 'Fetches a specific site by its unique identifier.',
		request: z.object({}),
		response: z.array(
			z.object({
				id: z.string(),
				title: z.string(),
				createdAt: z.date(),
				updatedAt: z.date()
			})
		)
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
