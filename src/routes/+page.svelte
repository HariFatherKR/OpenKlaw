<script lang="ts">
	import Chat from '$lib/components/Chat.svelte';
</script>

<svelte:head>
	<title>OpenKlaw - 로컬 AI 비서</title>
</svelte:head>

<main class="flex-1 flex flex-col">
	<header class="bg-surface px-4 py-3 flex items-center justify-between border-b border-gray-700">
		<div class="flex items-center gap-2">
			<span class="text-2xl">🦞</span>
			<h1 class="text-xl font-bold text-primary">OpenKlaw</h1>
		</div>
		<span class="text-sm text-muted">로컬 AI 비서</span>
	</header>
	
	<Chat />
</main>

<style>
	.bg-surface {
		background-color: var(--color-surface);
	}
	.text-primary {
		color: var(--color-primary);
	}
	.text-muted {
		color: var(--color-text-muted);
	}
</style>
