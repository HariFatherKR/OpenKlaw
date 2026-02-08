<script lang="ts">
	import { REPORT_TEMPLATES } from '$lib/skills/report';
	
	export interface QuickAction {
		id: string;
		icon: string;
		label: string;
		action: 'prompt' | 'template' | 'custom';
		prompt?: string;
		templateId?: string;
	}
	
	interface Props {
		onAction: (action: QuickAction) => void;
		onOpenTemplates: () => void;
	}
	
	let { onAction, onOpenTemplates }: Props = $props();
	
	// 기본 빠른 작업 버튼들
	const defaultActions: QuickAction[] = [
		{
			id: 'hwp-summary',
			icon: '📄',
			label: 'HWP 요약',
			action: 'prompt',
			prompt: 'HWP 파일을 드래그하거나 텍스트를 붙여넣어 주세요. 요약해 드릴게요.'
		},
		{
			id: 'email',
			icon: '📧',
			label: '이메일 작성',
			action: 'prompt',
			prompt: '어떤 이메일을 작성할까요? 받는 사람, 용건을 알려주세요.'
		},
		{
			id: 'excel',
			icon: '📊',
			label: '엑셀 분석',
			action: 'prompt',
			prompt: '엑셀/CSV 파일을 드래그하거나 데이터를 붙여넣어 주세요. 분석해 드릴게요.'
		},
		{
			id: 'report',
			icon: '📋',
			label: '보고서',
			action: 'template'
		},
		{
			id: 'translate',
			icon: '🌐',
			label: '번역',
			action: 'prompt',
			prompt: '번역할 텍스트를 입력해주세요. 한↔영 자동 감지합니다.'
		},
		{
			id: 'proofread',
			icon: '✍️',
			label: '맞춤법',
			action: 'prompt',
			prompt: '맞춤법 검사할 텍스트를 붙여넣어 주세요.'
		}
	];
	
	let isExpanded = $state(false);
	
	function handleAction(action: QuickAction) {
		if (action.action === 'template') {
			onOpenTemplates();
		} else {
			onAction(action);
		}
		isExpanded = false;
	}
</script>

<div class="quick-actions-container">
	<button 
		class="toggle-btn" 
		class:expanded={isExpanded}
		onclick={() => isExpanded = !isExpanded}
		title="빠른 작업"
	>
		<span class="icon">{isExpanded ? '✕' : '⚡'}</span>
	</button>
	
	{#if isExpanded}
		<div class="actions-panel">
			<div class="actions-header">빠른 작업</div>
			<div class="actions-grid">
				{#each defaultActions as action}
					<button 
						class="action-btn"
						onclick={() => handleAction(action)}
					>
						<span class="action-icon">{action.icon}</span>
						<span class="action-label">{action.label}</span>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.quick-actions-container {
		position: relative;
	}
	
	.toggle-btn {
		width: 44px;
		height: 44px;
		border-radius: 12px;
		background: linear-gradient(135deg, rgba(74, 124, 89, 0.3), rgba(45, 90, 63, 0.2));
		border: 1px solid rgba(74, 124, 89, 0.4);
		color: #D4A574;
		font-size: 1.25rem;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.toggle-btn:hover {
		background: linear-gradient(135deg, rgba(74, 124, 89, 0.4), rgba(45, 90, 63, 0.3));
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}
	
	.toggle-btn.expanded {
		background: rgba(229, 115, 115, 0.2);
		border-color: rgba(229, 115, 115, 0.3);
		color: #E57373;
	}
	
	.icon {
		transition: transform 0.2s;
	}
	
	.toggle-btn.expanded .icon {
		transform: rotate(90deg);
	}
	
	.actions-panel {
		position: absolute;
		bottom: 100%;
		left: 0;
		margin-bottom: 0.75rem;
		/* Dark pistachio glassmorphism */
		background: rgba(45, 90, 63, 0.95);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(74, 124, 89, 0.3);
		border-radius: 16px;
		padding: 1rem;
		min-width: 280px;
		animation: slideUp 0.2s ease-out;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
	}
	
	@keyframes slideUp {
		from { 
			opacity: 0; 
			transform: translateY(10px); 
		}
		to { 
			opacity: 1; 
			transform: translateY(0); 
		}
	}
	
	.actions-header {
		font-size: 0.8rem;
		font-weight: 600;
		color: #BCAAA4;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.75rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid rgba(74, 124, 89, 0.3);
	}
	
	.actions-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
	}
	
	.action-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		padding: 0.75rem 0.5rem;
		background: rgba(74, 124, 89, 0.2);
		border: 1px solid rgba(74, 124, 89, 0.25);
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.action-btn:hover {
		background: rgba(212, 165, 116, 0.15);
		border-color: rgba(212, 165, 116, 0.3);
		transform: translateY(-1px);
	}
	
	.action-icon {
		font-size: 1.25rem;
	}
	
	.action-label {
		font-size: 0.75rem;
		color: #FFF8E1;
		font-weight: 500;
		white-space: nowrap;
	}
</style>
