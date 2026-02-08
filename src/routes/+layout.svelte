<script lang="ts">
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	
	let { children } = $props();
</script>

<div class="app-layout">
	<Sidebar />
	<main class="main-content">
		{@render children()}
	</main>
</div>

<style>
	.app-layout {
		min-height: 100vh;
		display: flex;
		background: linear-gradient(
			135deg,
			#0f172a 0%,
			#1e293b 50%,
			#0f172a 100%
		);
	}
	
	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow-x: hidden;
	}
</style>
