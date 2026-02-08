<script lang="ts">
	interface Props {
		title?: string;
		icon?: string;
		class?: string;
		fullWidth?: boolean;
		children: import('svelte').Snippet;
		headerAction?: import('svelte').Snippet;
	}
	
	let { title, icon, class: className = '', fullWidth = false, children, headerAction }: Props = $props();
</script>

<div class="glass-card {className}" class:full-width={fullWidth}>
	{#if title}
		<div class="card-header">
			<div class="card-title">
				{#if icon}
					<span class="card-icon">{icon}</span>
				{/if}
				<h3>{title}</h3>
			</div>
			{#if headerAction}
				<div class="card-action">
					{@render headerAction()}
				</div>
			{/if}
		</div>
	{/if}
	<div class="card-content">
		{@render children()}
	</div>
</div>

<style>
	.glass-card {
		/* Dark pistachio glassmorphism - Dubai Crab style */
		background: rgba(74, 124, 89, 0.15);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(74, 124, 89, 0.25);
		border-radius: 20px;
		padding: 1.5rem;
		/* Multi-layer shadow for depth */
		box-shadow: 
			0 2px 4px rgba(0, 0, 0, 0.1),
			0 4px 8px rgba(0, 0, 0, 0.1),
			0 8px 16px rgba(0, 0, 0, 0.15),
			0 16px 32px rgba(0, 0, 0, 0.2),
			inset 0 1px 1px rgba(74, 124, 89, 0.2);
		position: relative;
		overflow: hidden;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
	
	/* Shimmer/glitter effect */
	.glass-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 50%;
		background: linear-gradient(
			135deg,
			rgba(74, 124, 89, 0.15) 0%,
			rgba(74, 124, 89, 0.05) 30%,
			transparent 60%
		);
		pointer-events: none;
		border-radius: 20px 20px 0 0;
	}
	
	.glass-card:hover {
		transform: translateY(-2px);
		box-shadow: 
			0 4px 8px rgba(0, 0, 0, 0.15),
			0 8px 16px rgba(0, 0, 0, 0.2),
			0 16px 32px rgba(0, 0, 0, 0.25),
			0 24px 48px rgba(0, 0, 0, 0.3),
			inset 0 1px 1px rgba(74, 124, 89, 0.3);
	}
	
	.glass-card.full-width {
		grid-column: 1 / -1;
	}
	
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.25rem;
	}
	
	.card-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	
	.card-icon {
		font-size: 1.25rem;
	}
	
	.card-title h3 {
		font-size: 1rem;
		font-weight: 600;
		color: #FFF8E1;
		margin: 0;
	}
	
	.card-action {
		font-size: 0.85rem;
		color: #D4A574;
	}
	
	.card-action :global(a) {
		color: inherit;
		text-decoration: none;
	}
	
	.card-action :global(a:hover) {
		color: #B8860B;
	}
	
	.card-content {
		color: #D7CCC8;
	}
</style>
