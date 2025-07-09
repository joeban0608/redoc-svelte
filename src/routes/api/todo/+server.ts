import { db } from '$lib/server/db';
import { todoList } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { API } from '$lib/fetcher/server';

// export const GET: RequestHandler = async () => {
// 	return new Response();
// };

export const POST: RequestHandler = async (event) => {
	return API.HANDLE({ url: 'POST /api/todo', event }, async ({ data }) => {
		const { title } = data;
		if (!title) {
			throw API.ERROR(400, 'POST /api/tod - Invalid input');
		}

		try {
			const todo = await db
				.insert(todoList)
				.values({
					id: crypto.randomUUID(),
					title,
					createdAt: new Date(),
					updatedAt: new Date()
				})
				.returning();
			if (!todo.length) {
				throw new Error('Failed to create todo with todo_list db');
			}

			return todo[0];
		} catch (error) {
			console.error('Error creating todo', { error });
			throw API.ERROR(500, 'POST /api/todo - An error has occurred');
		}
	});
};

export const DELETE: RequestHandler = async (event) => {
	return API.HANDLE({ url: 'DELETE /api/todo', event }, async ({ data }) => {
		const { id } = data;

		if (!id) {
			throw API.ERROR(400, 'DELETE /api/todo - Invalid input');
		}

		try {
			await db.delete(todoList).where(eq(todoList.id, id));
			return { message: 'Todo deleted successfully' };
		} catch (error) {
			console.error('Error deleting todo', { error });
			throw API.ERROR(500, 'DELETE /api/todo - An error has occurred');
		}
	});
};

export const PUT: RequestHandler = async (event) => {
	return API.HANDLE({ url: 'PUT /api/todo', event }, async ({ data }) => {
		const { id, title } = data;

		if (!id || !title) {
			throw API.ERROR(400, 'PUT /api/todo - Invalid input');
		}

		try {
			const todo = await db
				.update(todoList)
				.set({ title, updatedAt: new Date() })
				.where(eq(todoList.id, id))
				.returning();
			if (!todo.length) {
				throw new Error('Failed to update todo with todo_list db');
			}

			return todo[0];
		} catch (error) {
			console.error('Error updating todo', { error });
			throw API.ERROR(500, 'PUT /api/todo - An error has occurred');
		}
	});
};
