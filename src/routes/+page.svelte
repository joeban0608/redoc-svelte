<script>
	import { PUBLIC_ORIGIN } from '$env/static/public';
</script>

<header class="flex items-center gap-4 bg-gray-100 p-4 shadow">
	<a
		href={`${PUBLIC_ORIGIN}/demo/lucia/login`}
		class="inline-block rounded bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
	>
		Login
	</a>
	<a
		href={`${PUBLIC_ORIGIN}/docs`}
		class="inline-block rounded bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
	>
		document
	</a>
</header>
<main class="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
	<h1 class="mb-4 text-4xl font-bold text-blue-600">Welcome to SvelteKit</h1>
	<p class="mb-6 text-lg text-gray-700">
		Visit
		<a href="https://svelte.dev/docs/kit" class="text-blue-500 underline hover:text-blue-700"
			>svelte.dev/docs/kit</a
		>
		to read the documentation
	</p>
</main>
