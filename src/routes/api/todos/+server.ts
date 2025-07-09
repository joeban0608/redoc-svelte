import { API } from '$lib/fetcher/server';
import { db } from '$lib/server/db';
import { todoList } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return API.HANDLE({ url: 'GET /api/todos', event }, async (_data) => {
		try {
			const todos = await db.select().from(todoList);
			return todos;
		} catch (error) {
			console.error('Error fetching todos', { error });
			throw API.ERROR(500, 'GET /api/todos - An error has occurred');
		}
	});
};
