<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700"
		rel="stylesheet"
	/>
</svelte:head>
{@render children()}
