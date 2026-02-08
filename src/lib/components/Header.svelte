<script lang="ts">
	interface Props {
		title?: string;
		subtitle?: string;
		userName?: string;
	}
	
	let { title = 'Dashboard', subtitle = '', userName = 'User' }: Props = $props();
</script>

<header class="app-header">
	<div class="header-left">
		<p class="welcome-text">Welcome back, {userName} 👋</p>
		<h1 class="page-title">{title}</h1>
		{#if subtitle}
			<p class="page-subtitle">{subtitle}</p>
		{/if}
	</div>
	
	<div class="header-right">
		<button class="icon-button" aria-label="Search">
			🔍
		</button>
		<button class="icon-button" aria-label="Notifications">
			🔔
		</button>
		<div class="profile-section">
			<div class="profile-avatar">
				👤
			</div>
			<span class="profile-name">{userName}</span>
		</div>
	</div>
</header>

<style>
	.app-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 1.5rem 2rem;
	}
	
	.header-left {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	
	.welcome-text {
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.6);
		margin: 0;
	}
	
	.page-title {
		font-size: 1.75rem;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.95);
		margin: 0;
	}
	
	.page-subtitle {
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.5);
		margin: 0.25rem 0 0 0;
	}
	
	.header-right {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	
	.icon-button {
		width: 40px;
		height: 40px;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-size: 1rem;
		transition: all 0.2s ease;
	}
	
	.icon-button:hover {
		background: rgba(255, 255, 255, 0.15);
	}
	
	.profile-section {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 1rem 0.5rem 0.5rem;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 50px;
	}
	
	.profile-avatar {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: linear-gradient(135deg, #14b8a6, #06b6d4);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.25rem;
	}
	
	.profile-name {
		font-size: 0.9rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.9);
	}
	
	@media (max-width: 768px) {
		.app-header {
			flex-direction: column;
			gap: 1rem;
			padding: 1rem;
		}
		
		.profile-name {
			display: none;
		}
	}
</style>
