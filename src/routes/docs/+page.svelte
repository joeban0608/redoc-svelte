<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div>
	<redoc spec-url="http://localhost:5173/docs/1.0.0/openApi.json"></redoc>
	<script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js">
	</script>
</div>
