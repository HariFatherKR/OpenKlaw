<script lang="ts">
	import '../app.css';
	
	let { children } = $props();
</script>

<div class="app-container">
	{@render children()}
</div>

<style>
	.app-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
