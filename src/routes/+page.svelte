<script lang="ts">
	import { PUBLIC_ORIGIN } from '$env/static/public';
	import type { TodoList } from '$lib/server/db/schema';
	import { onMount } from 'svelte';

	let title = $state('');
	let todos: TodoList[] = $state([]);

	async function loadTodos() {
		const res = await fetch(`${PUBLIC_ORIGIN}/api/todos`);
		if (res.ok) {
			const todosRes = await res.json();
			console.log('Todos loaded:', todosRes);
			todos = todosRes; // Update the todos state with the fetched data
		} else {
			console.error('Error loading todos:', await res.text());
			todos = [];
		}
	}

	async function createTodo() {
		try {
			const res = await fetch(`${PUBLIC_ORIGIN}/api/todo`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					title
				})
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.message || 'Failed to create todo');
			}
			console.log('Todo created:', data);
			todos = [...todos, data]; // Add the new todo to the state
		} catch (error) {
			console.error('Error creating todo:', error);
		}
		title = ''; // Clear the input field even if there's an error
	}

	async function deleteTodo(id: string) {
		try {
			const res = await fetch(`${PUBLIC_ORIGIN}/api/todo`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id })
			});
			if (!res.ok) {
				throw new Error('Failed to delete todo');
			}
			console.log('Todo deleted:', id);
			todos = todos.filter((todo) => todo.id !== id); // Remove the deleted todo from the state
		} catch (error) {
			console.error('Error deleting todo:', error);
		}
	}

	async function updateTodo(id: string, newTitle: string) {
		try {
			const res = await fetch(`${PUBLIC_ORIGIN}/api/todo`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id, title: newTitle })
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.message || 'Failed to update todo');
			}
			console.log('Todo updated:', data);
			todos = todos.map((todo) => (todo.id === id ? { ...todo, title: newTitle } : todo));
		} catch (error) {
			console.error('Error updating todo:', error);
		}
	}

	onMount(() => {
		loadTodos();
	});
</script>

<header class="sticky top-0 flex items-center gap-4 bg-gray-100 p-4 shadow">
	<!-- <a
		href={`${PUBLIC_ORIGIN}/demo/lucia/login`}
		class="inline-block rounded bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
	>
		Login
	</a> -->
	<a
		href={`${PUBLIC_ORIGIN}/docs`}
		class="inline-block rounded bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
	>
		document
	</a>
</header>
<main class="flex min-h-screen flex-col items-center justify-start bg-gray-50 p-8">
	<!-- todo list form -->
	<form class="mb-8 flex w-full max-w-md flex-col gap-4 rounded bg-white p-6 shadow">
		<h2 class="mb-4 text-2xl font-bold text-gray-800">Todo List</h2>
		<input
			bind:value={title}
			type="text"
			name="todo"
			placeholder="Enter a new todo"
			class="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
			required
		/>
		<button
			onclick={createTodo}
			class="mt-2 inline-block rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
		>
			Add Todo
		</button>
	</form>
	<!-- todo list form end -->
	<!-- todo list display -->
	{#if todos?.length}
		<div class="w-full max-w-md p-3 shadow">
			<h2 class="mb-4 text-2xl font-bold text-gray-800">Todo List Items</h2>
			<ul class="space-y-4">
				{#each todos as todo (todo.id)}
					{@const id = todo.id}
					<li class="flex flex-col gap-2 rounded bg-white p-4 shadow">
						<div class="flex items-center justify-between">
							<span class="font-semibold text-gray-700">{todo.title}</span>
							<div class="flex gap-2">
								<button
									onclick={() => {
										const newTitle = prompt('Update todo title:', todo.title);
										if (newTitle) {
											updateTodo(id, newTitle);
										}
									}}
									class="inline-block rounded bg-yellow-500 px-4 py-2 text-white transition hover:bg-yellow-600"
								>
									Update
								</button>
								<button
									onclick={() => {
										deleteTodo(id);
									}}
									class="inline-block rounded bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
								>
									Delete
								</button>
							</div>
						</div>
						<div class="text-xs text-gray-500">
							<div><strong>ID:</strong> {id}</div>
							<div><strong>Created:</strong> {new Date(todo.createdAt).toLocaleString()}</div>
							<div><strong>Updated:</strong> {new Date(todo.updatedAt).toLocaleString()}</div>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
	<!-- todo list display end -->
</main>
