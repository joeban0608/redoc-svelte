import { db } from '$lib/server/db';
import { todoList } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const todos = await db.select().from(todoList);
		return new Response(JSON.stringify(todos), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.log('Error fetching todos', { error });
		return new Response(JSON.stringify({ error: 'An error has occurred' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
