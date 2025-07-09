import { db } from '$lib/server/db';
import { todoList } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response();
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { title } = body;

	if (!title) {
		return new Response(JSON.stringify({ error: 'Invalid input' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
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

		return new Response(JSON.stringify(todo[0]), {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error creating todo', { error });
		return new Response(JSON.stringify({ error: 'An error has occurred' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

export const DELETE: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { id } = body;

	if (!id) {
		return new Response(JSON.stringify({ error: 'Invalid input' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		await db.delete(todoList).where(eq(todoList.id, id));
		return new Response(JSON.stringify({ message: 'Todo deleted successfully' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error deleting todo', { error });
		return new Response(JSON.stringify({ error: 'An error has occurred' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

export const PUT: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { id, title } = body;

	if (!id || !title) {
		return new Response(JSON.stringify({ error: 'Invalid input' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const todo = await db
			.update(todoList)
			.set({ title, updatedAt: new Date() })
			.where(eq(todoList.id, id))
			.returning();

		return new Response(JSON.stringify(todo[0]), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error updating todo', { error });
		return new Response(JSON.stringify({ error: 'An error has occurred' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};