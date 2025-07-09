import { API } from '$lib/fetcher/server';
import { db } from '$lib/server/db';
import { todoList } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	return API.HANDLE({ url: 'GET /api/todos', event }, async ({ data }) => {
		const { page = 1, limit = 25 } = data;

		try {
			const todos = await db
				.select()
				.from(todoList)
				.limit(limit)
				.offset((page - 1) * limit);

			const total = await db.$count(todoList);
			console.log('Total todos:', total);
			return {
				pagination: {
					page: Number(page),
					limit: Number(limit),
					total
				},
				items: todos
			};
		} catch (error) {
			console.error('Error fetching todos', { error });
			throw API.ERROR(500, 'GET /api/todos - An error has occurred');
		}
	});
};
