<script lang="ts">
	import { gatewayStore, type ConnectionMode } from '$lib/stores/gateway-store';
	import { checkGatewayStatus } from '$lib/gateway-client';
	import { isHealthy } from '$lib/ollama';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
	}

	let { isOpen, onClose }: Props = $props();

	let mode = $state<ConnectionMode>('ollama');
	let gatewayUrl = $state('ws://127.0.0.1:18789');
	let gatewayToken = $state('');
	let ollamaStatus = $state<'checking' | 'connected' | 'disconnected'>('checking');
	let gatewayStatus = $state<'checking' | 'connected' | 'disconnected'>('checking');
	let statusMessage = $state('');

	// 초기화
	$effect(() => {
		if (isOpen) {
			const state = gatewayStore.getState();
			mode = state.mode;
			gatewayUrl = state.gatewayUrl;
			gatewayToken = state.gatewayToken;
			checkConnections();
		}
	});

	async function checkConnections() {
		// Ollama 체크
		ollamaStatus = 'checking';
		const ollamaOk = await isHealthy();
		ollamaStatus = ollamaOk ? 'connected' : 'disconnected';

		// Gateway 체크
		gatewayStatus = 'checking';
		const gwStatus = await checkGatewayStatus();
		gatewayStatus = gwStatus.available ? 'connected' : 'disconnected';
	}

	function handleSave() {
		gatewayStore.setMode(mode);
		gatewayStore.setGatewayUrl(gatewayUrl);
		gatewayStore.setGatewayToken(gatewayToken);
		
		if (mode === 'gateway') {
			gatewayStore.connectGateway();
		}

		statusMessage = '✅ 설정이 저장되었습니다';
		setTimeout(() => {
			statusMessage = '';
			onClose();
		}, 1000);
	}

	function getStatusIcon(status: string): string {
		switch (status) {
			case 'checking': return '⏳';
			case 'connected': return '🟢';
			case 'disconnected': return '🔴';
			default: return '⚪';
		}
	}
</script>

{#if isOpen}
<div class="modal-overlay" onclick={onClose} onkeydown={(e) => e.key === 'Escape' && onClose()} role="button" tabindex="0">
	<div class="modal-content" onclick={(e) => e.stopPropagation()} role="dialog">
		<div class="modal-header">
			<h2>⚙️ 설정</h2>
			<button class="close-btn" onclick={onClose}>✕</button>
		</div>

		<div class="modal-body">
			<!-- 연결 모드 선택 -->
			<section class="setting-section">
				<h3>연결 모드</h3>
				
				<label class="radio-option" class:selected={mode === 'ollama'}>
					<input type="radio" bind:group={mode} value="ollama" />
					<div class="option-content">
						<div class="option-header">
							<span class="option-title">🦙 Ollama (로컬)</span>
							<span class="status-badge">{getStatusIcon(ollamaStatus)}</span>
						</div>
						<p class="option-desc">로컬 Ollama 서버에 직접 연결. 완전 오프라인.</p>
					</div>
				</label>

				<label class="radio-option" class:selected={mode === 'gateway'}>
					<input type="radio" bind:group={mode} value="gateway" />
					<div class="option-content">
						<div class="option-header">
							<span class="option-title">🦀 Gateway (Dubai Crab Core)</span>
							<span class="status-badge">{getStatusIcon(gatewayStatus)}</span>
						</div>
						<p class="option-desc">게이트웨이 서버 연결. Telegram/Discord/Slack 연동 가능.</p>
					</div>
				</label>
			</section>

			<!-- Gateway 설정 (Gateway 모드일 때만) -->
			{#if mode === 'gateway'}
			<section class="setting-section">
				<h3>Gateway 설정</h3>
				
				<div class="form-group">
					<label for="gateway-url">Gateway URL</label>
					<input 
						id="gateway-url"
						type="text" 
						bind:value={gatewayUrl}
						placeholder="ws://127.0.0.1:18789"
					/>
				</div>

				<div class="form-group">
					<label for="gateway-token">Auth Token (선택)</label>
					<input 
						id="gateway-token"
						type="password" 
						bind:value={gatewayToken}
						placeholder="인증 토큰 (없으면 비워두세요)"
					/>
				</div>

				<button class="test-btn" onclick={checkConnections}>
					🔄 연결 테스트
				</button>
			</section>
			{/if}

			{#if statusMessage}
			<div class="status-message">{statusMessage}</div>
			{/if}
		</div>

		<div class="modal-footer">
			<button class="cancel-btn" onclick={onClose}>취소</button>
			<button class="save-btn" onclick={handleSave}>저장</button>
		</div>
	</div>
</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		backdrop-filter: blur(4px);
	}

	.modal-content {
		background: #1a1a1a;
		border-radius: 12px;
		width: 90%;
		max-width: 500px;
		max-height: 80vh;
		overflow-y: auto;
		border: 1px solid #333;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid #333;
	}

	.modal-header h2 {
		margin: 0;
		font-size: 1.25rem;
		color: #10B981;
	}

	.close-btn {
		background: none;
		border: none;
		color: #888;
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0;
		line-height: 1;
	}

	.close-btn:hover {
		color: #fff;
	}

	.modal-body {
		padding: 1.5rem;
	}

	.setting-section {
		margin-bottom: 1.5rem;
	}

	.setting-section h3 {
		color: #888;
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.75rem;
	}

	.radio-option {
		display: block;
		background: #222;
		border: 2px solid #333;
		border-radius: 8px;
		padding: 1rem;
		margin-bottom: 0.5rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.radio-option:hover {
		border-color: #444;
	}

	.radio-option.selected {
		border-color: #10B981;
		background: rgba(16, 185, 129, 0.1);
	}

	.radio-option input[type="radio"] {
		display: none;
	}

	.option-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.option-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.option-title {
		font-weight: 600;
		color: #fff;
	}

	.option-desc {
		color: #888;
		font-size: 0.875rem;
		margin: 0;
	}

	.status-badge {
		font-size: 0.875rem;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	.form-group label {
		display: block;
		color: #888;
		font-size: 0.875rem;
		margin-bottom: 0.5rem;
	}

	.form-group input {
		width: 100%;
		padding: 0.75rem;
		background: #222;
		border: 1px solid #333;
		border-radius: 6px;
		color: #fff;
		font-size: 0.875rem;
	}

	.form-group input:focus {
		outline: none;
		border-color: #10B981;
	}

	.test-btn {
		background: #333;
		color: #fff;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.875rem;
	}

	.test-btn:hover {
		background: #444;
	}

	.status-message {
		background: rgba(16, 185, 129, 0.1);
		color: #10B981;
		padding: 0.75rem;
		border-radius: 6px;
		text-align: center;
		margin-top: 1rem;
	}

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		padding: 1rem 1.5rem;
		border-top: 1px solid #333;
	}

	.cancel-btn, .save-btn {
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		font-size: 0.875rem;
		cursor: pointer;
		border: none;
	}

	.cancel-btn {
		background: #333;
		color: #fff;
	}

	.save-btn {
		background: #10B981;
		color: #fff;
	}

	.cancel-btn:hover {
		background: #444;
	}

	.save-btn:hover {
		background: #059669;
	}
</style>
