<script lang="ts">
	import Chat from '$lib/components/Chat.svelte';
	import Header from '$lib/components/Header.svelte';
</script>

<svelte:head>
	<title>Dubai Crab - 로컬 AI 비서</title>
</svelte:head>

<Header title="채팅" subtitle="로컬 AI 비서와 대화하세요" userName="User" />

<div class="chat-page">
	<Chat />
</div>

<style>
	.chat-page {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 0 2rem 2rem 2rem;
	}
</style>
