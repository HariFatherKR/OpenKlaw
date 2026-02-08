<script lang="ts">
	import { page } from '$app/stores';
	
	interface NavItem {
		href: string;
		icon: string;
		label: string;
	}
	
	const navItems: NavItem[] = [
		{ href: '/dashboard', icon: '📊', label: 'Dashboard' },
		{ href: '/', icon: '💬', label: '채팅' },
		{ href: '/settings', icon: '⚙️', label: '설정' }
	];
	
	let currentPath = $derived($page.url.pathname);
</script>

<aside class="sidebar">
	<div class="sidebar-header">
		<div class="logo">
			<span class="logo-icon">🦀</span>
			<span class="logo-text">Dubai Crab</span>
		</div>
	</div>
	
	<nav class="sidebar-nav">
		{#each navItems as item}
			<a 
				href={item.href} 
				class="nav-item" 
				class:active={currentPath === item.href || (item.href === '/' && currentPath === '/')}
			>
				<span class="nav-icon">{item.icon}</span>
				<span class="nav-label">{item.label}</span>
			</a>
		{/each}
	</nav>
	
	<div class="sidebar-footer">
		<div class="version-badge">
			<span>v0.1.0</span>
		</div>
	</div>
</aside>

<style>
	.sidebar {
		width: 220px;
		min-height: 100vh;
		/* Dark pistachio glassmorphism */
		background: rgba(45, 90, 63, 0.4);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-right: 1px solid rgba(74, 124, 89, 0.3);
		display: flex;
		flex-direction: column;
		padding: 1.5rem 1rem;
		/* Multi-layer shadow for depth */
		box-shadow: 
			4px 0 8px rgba(0, 0, 0, 0.1),
			8px 0 16px rgba(0, 0, 0, 0.1),
			16px 0 32px rgba(0, 0, 0, 0.15),
			inset -1px 0 0 rgba(74, 124, 89, 0.2);
		position: relative;
	}
	
	/* Subtle shimmer on sidebar */
	.sidebar::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 150px;
		background: linear-gradient(
			180deg,
			rgba(74, 124, 89, 0.2) 0%,
			transparent 100%
		);
		pointer-events: none;
	}
	
	.sidebar-header {
		margin-bottom: 2rem;
	}
	
	.logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem;
	}
	
	.logo-icon {
		font-size: 2rem;
	}
	
	.logo-text {
		font-size: 1.25rem;
		font-weight: 700;
		background: linear-gradient(135deg, #D4A574, #B8860B);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	
	.sidebar-nav {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex: 1;
	}
	
	.nav-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
		border-radius: 12px;
		text-decoration: none;
		color: #D7CCC8;
		font-size: 0.95rem;
		font-weight: 500;
		transition: all 0.2s ease;
	}
	
	.nav-item:hover {
		background: rgba(74, 124, 89, 0.3);
		color: #FFF8E1;
	}
	
	.nav-item.active {
		background: linear-gradient(135deg, rgba(74, 124, 89, 0.4), rgba(45, 90, 63, 0.3));
		color: #D4A574;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(212, 165, 116, 0.3);
	}
	
	.nav-icon {
		font-size: 1.25rem;
	}
	
	.nav-label {
		letter-spacing: 0.01em;
	}
	
	.sidebar-footer {
		padding-top: 1rem;
		border-top: 1px solid rgba(74, 124, 89, 0.2);
	}
	
	.version-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		background: rgba(74, 124, 89, 0.2);
		border-radius: 8px;
		font-size: 0.8rem;
		color: #BCAAA4;
	}
</style>
