<script lang="ts">
	import { PUBLIC_ORIGIN } from '$env/static/public';
	import fetcher from '$lib/fetcher';
	import type { FetcherResponse } from '$lib/type';
	import { onMount } from 'svelte';

	let title = $state('');
	let todos: FetcherResponse<'GET /api/todos'>['items'] = $state([]);
	let page = $state(1);
	let limit = $state(1);
	let total = $state(0);

	async function loadTodos() {
		const resp = await fetcher({
			url: 'GET /api/todos',
			request: {
				page,
				limit
			}
		});
		if (resp.status === 'error') {
			console.error('Error fetching todos:', resp.message);
			// toast.error(m.error_fetching_data({ message: resp.message }));
			return;
		}
		todos = resp.data.items; // Assuming the response has a data property with items
		total = resp.data.pagination.total; // Assuming the response has a total property
	}
	async function nextPage() {
		if (page * limit >= total) return; // No more items to load
		page += 1;
		await loadTodos();
	}
	async function previousPage() {
		if (page <= 1) return; // Already on the first page
		page -= 1;
		await loadTodos();
	}

	async function createTodo() {
		const resp = await fetcher({ url: 'POST /api/todo', request: { title } });
		if (resp.status === 'error') {
			console.error('Error create todo:', resp.message);
			return;
		}
		todos = [...todos, resp.data]; // Add the new todo to the state
		title = ''; // Clear the input field even if there's an error
	}

	async function deleteTodo(id: string) {
		const resp = await fetcher({ url: 'DELETE /api/todo', request: { id } });
		if (resp.status === 'error') {
			console.error('Error deleting todo:', resp.message);
			return;
		}
		todos = todos.filter((todo) => todo.id !== id); // Remove the deleted todo from the state
	}

	async function updateTodo(id: string, newTitle: string) {
		const resp = await fetcher({ url: 'PUT /api/todo', request: { id, title: newTitle } });
		if (resp.status === 'error') {
			console.error('Error updating todo:', resp.message);
			return;
		}
		todos = todos.map((todo) => (todo.id === id ? { ...todo, title: newTitle } : todo));
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

	<!-- todo list display -->
	<div class="w-full max-w-md p-3 shadow">
		<h2 class="mb-4 text-2xl font-bold text-gray-800">Todo List Items</h2>
		<!-- 分頁資訊與操作 -->
		<div class="mb-6 flex flex-wrap items-center justify-between gap-4">
			<div class="flex flex-wrap items-center gap-5 text-base text-gray-700">
				<p class="flex items-center gap-2">
					<strong>Total: </strong>
					<span class="rounded bg-gray-200 px-2 py-1">{total} items</span>
				</p>

				<div class="flex items-center gap-2">
					<strong>Limit:</strong>
					<select
						bind:value={limit}
						class="w-12 rounded border border-gray-300 px-2 py-1 focus:border-blue-500 focus:outline-none"
						onchange={async () => {
							page = 1; // Reset to first page when limit changes
							await loadTodos();
						}}
					>
						<option value={1}>1</option>
						<option value={5}>5</option>
						<option value={10}>10</option>
						<option value={20}>20</option>
					</select>
				</div>

				<p class="flex items-center gap-2">
					<strong>Page:</strong>
					<span class="rounded bg-gray-200 px-2 py-1">{page}</span>
				</p>
			</div>

			<div class="flex gap-2">
				<button
					onclick={previousPage}
					class="rounded border border-gray-300 bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
					disabled={page <= 1}
					aria-label="Previous Page"
				>
					&lt;
				</button>
				<button
					onclick={nextPage}
					class="rounded border border-gray-300 bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
					disabled={page * limit >= total}
					aria-label="Next Page"
				>
					&gt;
				</button>
			</div>
		</div>
		<!-- page next , page previous -->
		{#if todos?.length}
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
		{/if}
	</div>
</main>
