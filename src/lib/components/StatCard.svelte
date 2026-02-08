<script lang="ts">
	interface Props {
		icon: string;
		label: string;
		value: string | number;
		iconBg?: string;
	}
	
	let { icon, label, value, iconBg = 'bg-pistachio' }: Props = $props();
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
		/* Dark pistachio glassmorphism */
		background: rgba(74, 124, 89, 0.15);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(74, 124, 89, 0.25);
		border-radius: 16px;
		padding: 1.25rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		/* Multi-layer shadow for depth */
		box-shadow: 
			0 2px 4px rgba(0, 0, 0, 0.1),
			0 4px 8px rgba(0, 0, 0, 0.1),
			0 8px 16px rgba(0, 0, 0, 0.15),
			0 12px 24px rgba(0, 0, 0, 0.2),
			inset 0 1px 1px rgba(74, 124, 89, 0.2);
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
			rgba(74, 124, 89, 0.15) 0%,
			rgba(74, 124, 89, 0.05) 30%,
			transparent 60%
		);
		pointer-events: none;
		border-radius: 16px 16px 0 0;
	}
	
	.stat-card:hover {
		transform: translateY(-2px);
		box-shadow: 
			0 4px 8px rgba(0, 0, 0, 0.15),
			0 8px 16px rgba(0, 0, 0, 0.2),
			0 12px 24px rgba(0, 0, 0, 0.25),
			0 20px 40px rgba(0, 0, 0, 0.3),
			inset 0 1px 1px rgba(74, 124, 89, 0.3);
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
	
	/* Dark theme icon backgrounds */
	.stat-icon.bg-pistachio {
		background: linear-gradient(135deg, rgba(74, 124, 89, 0.4), rgba(45, 90, 63, 0.3));
	}
	
	.stat-icon.bg-teal {
		background: linear-gradient(135deg, rgba(74, 124, 89, 0.4), rgba(45, 90, 63, 0.3));
	}
	
	.stat-icon.bg-blue {
		background: linear-gradient(135deg, rgba(100, 181, 246, 0.3), rgba(66, 165, 245, 0.2));
	}
	
	.stat-icon.bg-purple {
		background: linear-gradient(135deg, rgba(186, 104, 200, 0.3), rgba(171, 71, 188, 0.2));
	}
	
	.stat-icon.bg-amber {
		background: linear-gradient(135deg, rgba(212, 165, 116, 0.4), rgba(184, 134, 11, 0.3));
	}
	
	.stat-icon.bg-golden {
		background: linear-gradient(135deg, rgba(212, 165, 116, 0.4), rgba(184, 134, 11, 0.3));
	}
	
	.stat-icon.bg-green {
		background: linear-gradient(135deg, rgba(129, 199, 132, 0.3), rgba(102, 187, 106, 0.2));
	}
	
	.stat-icon.bg-rose {
		background: linear-gradient(135deg, rgba(229, 115, 115, 0.3), rgba(239, 83, 80, 0.2));
	}
	
	.stat-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	
	.stat-label {
		font-size: 0.8rem;
		color: #BCAAA4;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	
	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: #FFF8E1;
	}
</style>
