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
		/* Dark Chocolate gradient background - Dubai Crab Style */
		background: linear-gradient(
			135deg,
			#3E2723 0%,
			#4E342E 25%,
			#5D4037 50%,
			#4E342E 75%,
			#3E2723 100%
		);
		background-attachment: fixed;
	}
	
	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow-x: hidden;
	}
</style>
