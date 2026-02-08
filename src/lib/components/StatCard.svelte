<script lang="ts">
	interface Props {
		icon: string;
		label: string;
		value: string | number;
		iconBg?: string;
	}
	
	let { icon, label, value, iconBg = 'bg-teal' }: Props = $props();
</script>

<div class="stat-card">
	<div class="stat-icon {iconBg}">
		{icon}
	</div>
	<div class="stat-info">
		<span class="stat-label">{label}</span>
		<span class="stat-value">{value}</span>
	</div>
</div>

<style>
	.stat-card {
		/* Light glassmorphism with depth */
		background: rgba(255, 255, 255, 0.65);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.9);
		border-radius: 16px;
		padding: 1.25rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		/* Multi-layer shadow for depth */
		box-shadow: 
			0 2px 4px rgba(0, 0, 0, 0.02),
			0 4px 8px rgba(0, 0, 0, 0.03),
			0 8px 16px rgba(0, 0, 0, 0.04),
			0 12px 24px rgba(0, 0, 0, 0.05),
			inset 0 1px 1px rgba(255, 255, 255, 0.8);
		position: relative;
		overflow: hidden;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
	
	/* Shimmer/glitter effect */
	.stat-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 50%;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.5) 0%,
			rgba(255, 255, 255, 0.2) 30%,
			transparent 60%
		);
		pointer-events: none;
		border-radius: 16px 16px 0 0;
	}
	
	.stat-card:hover {
		transform: translateY(-2px);
		box-shadow: 
			0 4px 8px rgba(0, 0, 0, 0.03),
			0 8px 16px rgba(0, 0, 0, 0.05),
			0 12px 24px rgba(0, 0, 0, 0.06),
			0 20px 40px rgba(0, 0, 0, 0.08),
			inset 0 1px 1px rgba(255, 255, 255, 0.9);
	}
	
	.stat-icon {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
	}
	
	/* Light theme backgrounds */
	.stat-icon.bg-teal {
		background: linear-gradient(135deg, rgba(20, 184, 166, 0.15), rgba(6, 182, 212, 0.1));
	}
	
	.stat-icon.bg-blue {
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(99, 102, 241, 0.1));
	}
	
	.stat-icon.bg-purple {
		background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(192, 132, 252, 0.1));
	}
	
	.stat-icon.bg-amber {
		background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(251, 191, 36, 0.1));
	}
	
	.stat-icon.bg-green {
		background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(74, 222, 128, 0.1));
	}
	
	.stat-icon.bg-rose {
		background: linear-gradient(135deg, rgba(244, 63, 94, 0.15), rgba(251, 113, 133, 0.1));
	}
	
	.stat-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	
	.stat-label {
		font-size: 0.8rem;
		color: #64748b;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	
	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: #1e293b;
	}
</style>
