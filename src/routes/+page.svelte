<script lang="ts">
	import { onMount } from 'svelte';
	import Chat from '$lib/components/Chat.svelte';
	import Header from '$lib/components/Header.svelte';
	import OnboardingModal from '$lib/components/OnboardingModal.svelte';

	let showOnboarding = $state(true);
	let isReady = $state(false);

	onMount(() => {
		// 온보딩 완료 여부 확인
		const completed = localStorage.getItem('dubaicrab-onboarding-complete');
		if (completed === 'true') {
			showOnboarding = false;
			isReady = true;
		}
	});

	function handleOnboardingComplete() {
		showOnboarding = false;
		isReady = true;
	}
</script>

<svelte:head>
	<title>Dubai Crab - 로컬 AI 비서</title>
</svelte:head>

{#if showOnboarding}
	<OnboardingModal onComplete={handleOnboardingComplete} />
{:else}
	<Header title="채팅" subtitle="무엇이든 물어보세요" userName="User" />

	<div class="chat-page">
		<Chat />
	</div>
{/if}

<style>
	.chat-page {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 0 2rem 2rem 2rem;
	}
</style>
