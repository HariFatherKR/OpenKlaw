<script lang="ts">
	import { onMount } from 'svelte';
	import { isHealthy, DEFAULT_MODEL } from '$lib/ollama';

	interface Props {
		onComplete: () => void;
	}

	let { onComplete }: Props = $props();

	let step = $state(1);
	let ollamaStatus = $state<'checking' | 'installed' | 'not-installed'>('checking');
	let modelStatus = $state<'checking' | 'installed' | 'not-installed' | 'downloading'>('checking');
	let downloadProgress = $state(0);
	let isAutoSetup = $state(false);
	let errorMessage = $state('');

	const totalSteps = 3;

	onMount(async () => {
		// 이미 온보딩 완료했는지 확인
		const completed = localStorage.getItem('dubaicrab-onboarding-complete');
		if (completed === 'true') {
			onComplete();
			return;
		}

		await checkOllama();
	});

	async function checkOllama() {
		ollamaStatus = 'checking';
		try {
			const healthy = await isHealthy();
			ollamaStatus = healthy ? 'installed' : 'not-installed';
			
			if (healthy) {
				await checkModel();
			}
		} catch {
			ollamaStatus = 'not-installed';
		}
	}

	async function checkModel() {
		modelStatus = 'checking';
		try {
			const response = await fetch('http://localhost:11434/api/tags');
			const data = await response.json();
			const models = data.models || [];
			
			const hasModel = models.some((m: any) => 
				m.name.includes('qwen') || m.name.includes('llama')
			);
			
			modelStatus = hasModel ? 'installed' : 'not-installed';
		} catch {
			modelStatus = 'not-installed';
		}
	}

	async function downloadModel() {
		modelStatus = 'downloading';
		downloadProgress = 0;
		errorMessage = '';

		try {
			const response = await fetch('http://localhost:11434/api/pull', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: DEFAULT_MODEL })
			});

			const reader = response.body?.getReader();
			if (!reader) throw new Error('스트림을 읽을 수 없습니다');

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const text = new TextDecoder().decode(value);
				const lines = text.split('\n').filter(Boolean);
				
				for (const line of lines) {
					try {
						const data = JSON.parse(line);
						if (data.total && data.completed) {
							downloadProgress = Math.round((data.completed / data.total) * 100);
						}
						if (data.status === 'success') {
							modelStatus = 'installed';
						}
					} catch {}
				}
			}

			modelStatus = 'installed';
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : '다운로드 실패';
			modelStatus = 'not-installed';
		}
	}

	async function handleAutoSetup() {
		isAutoSetup = true;
		
		// Ollama 확인
		await checkOllama();
		
		if (ollamaStatus === 'not-installed') {
			errorMessage = 'Ollama가 설치되지 않았습니다. ollama.com에서 설치해주세요.';
			isAutoSetup = false;
			return;
		}
		
		// 모델 다운로드
		if (modelStatus === 'not-installed') {
			await downloadModel();
		}
		
		isAutoSetup = false;
		
		if (modelStatus === 'installed') {
			completeOnboarding();
		}
	}

	function completeOnboarding() {
		localStorage.setItem('dubaicrab-onboarding-complete', 'true');
		onComplete();
	}

	function skipOnboarding() {
		localStorage.setItem('dubaicrab-onboarding-complete', 'true');
		onComplete();
	}

	function nextStep() {
		if (step < totalSteps) step++;
	}

	function prevStep() {
		if (step > 1) step--;
	}
</script>

<div class="onboarding-overlay">
	<div class="onboarding-modal">
		<!-- 헤더 -->
		<div class="modal-header">
			<div class="logo">🦀</div>
			<h1>Dubai Crab</h1>
			<p class="subtitle">한국 직장인을 위한 AI 비서</p>
		</div>

		<!-- 스텝 인디케이터 -->
		<div class="step-indicator">
			{#each Array(totalSteps) as _, i}
				<div class="step-dot" class:active={step === i + 1} class:completed={step > i + 1}></div>
			{/each}
		</div>

		<!-- 스텝 1: 환영 -->
		{#if step === 1}
		<div class="step-content">
			<h2>환영합니다! 👋</h2>
			<div class="feature-list">
				<div class="feature">
					<span class="icon">🔒</span>
					<div>
						<strong>완전 프라이빗</strong>
						<p>모든 데이터가 내 컴퓨터에서만 처리됩니다</p>
					</div>
				</div>
				<div class="feature">
					<span class="icon">📝</span>
					<div>
						<strong>한글 문서 지원</strong>
						<p>HWP, 엑셀, PDF 파일을 바로 분석</p>
					</div>
				</div>
				<div class="feature">
					<span class="icon">✉️</span>
					<div>
						<strong>업무 자동화</strong>
						<p>이메일, 보고서, 회의록 작성 도우미</p>
					</div>
				</div>
			</div>
			<button class="primary-btn" onclick={nextStep}>시작하기</button>
		</div>

		<!-- 스텝 2: 설정 확인 -->
		{:else if step === 2}
		<div class="step-content">
			<h2>설정 확인 ⚙️</h2>
			
			<div class="status-list">
				<div class="status-item">
					<span class="status-icon">
						{#if ollamaStatus === 'checking'}⏳
						{:else if ollamaStatus === 'installed'}✅
						{:else}❌{/if}
					</span>
					<div>
						<strong>Ollama</strong>
						<p>
							{#if ollamaStatus === 'checking'}확인 중...
							{:else if ollamaStatus === 'installed'}설치됨
							{:else}설치 필요{/if}
						</p>
					</div>
				</div>
				
				<div class="status-item">
					<span class="status-icon">
						{#if modelStatus === 'checking'}⏳
						{:else if modelStatus === 'installed'}✅
						{:else if modelStatus === 'downloading'}📥
						{:else}❌{/if}
					</span>
					<div>
						<strong>AI 모델 ({DEFAULT_MODEL})</strong>
						<p>
							{#if modelStatus === 'checking'}확인 중...
							{:else if modelStatus === 'installed'}준비됨
							{:else if modelStatus === 'downloading'}다운로드 중 ({downloadProgress}%)
							{:else}다운로드 필요{/if}
						</p>
					</div>
				</div>
			</div>

			{#if modelStatus === 'downloading'}
			<div class="progress-bar">
				<div class="progress-fill" style="width: {downloadProgress}%"></div>
			</div>
			{/if}

			{#if errorMessage}
			<div class="error-message">{errorMessage}</div>
			{/if}

			{#if ollamaStatus === 'not-installed'}
			<div class="help-box">
				<p>📥 <strong>Ollama 설치 방법:</strong></p>
				<ol>
					<li><a href="https://ollama.com/download" target="_blank">ollama.com/download</a> 방문</li>
					<li>macOS용 다운로드 및 설치</li>
					<li>설치 후 이 화면으로 돌아오기</li>
				</ol>
				<button class="secondary-btn" onclick={checkOllama}>다시 확인</button>
			</div>
			{:else if modelStatus === 'not-installed'}
			<button class="primary-btn" onclick={downloadModel} disabled={isAutoSetup}>
				{isAutoSetup ? '설정 중...' : '모델 다운로드 (약 2GB)'}
			</button>
			{:else if modelStatus === 'installed'}
			<button class="primary-btn" onclick={nextStep}>다음</button>
			{/if}

			<button class="skip-btn" onclick={skipOnboarding}>나중에 설정</button>
		</div>

		<!-- 스텝 3: 완료 -->
		{:else if step === 3}
		<div class="step-content">
			<h2>준비 완료! 🎉</h2>
			<div class="ready-message">
				<p>Dubai Crab이 준비되었습니다.</p>
				<p>이제 무엇이든 물어보세요!</p>
			</div>
			
			<div class="tips">
				<h3>💡 사용 팁</h3>
				<ul>
					<li><kbd>⌘ + Shift + O</kbd> : 어디서든 빠르게 열기</li>
					<li>파일을 드래그해서 분석하기</li>
					<li>"이메일 써줘"로 업무 메일 작성</li>
				</ul>
			</div>

			<button class="primary-btn" onclick={completeOnboarding}>시작하기</button>
		</div>
		{/if}

		<!-- 하단 -->
		<div class="modal-footer">
			{#if step > 1 && step < totalSteps}
			<button class="back-btn" onclick={prevStep}>← 이전</button>
			{/if}
		</div>
	</div>
</div>

<style>
	.onboarding-overlay {
		position: fixed;
		inset: 0;
		background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}

	.onboarding-modal {
		background: #111;
		border-radius: 16px;
		width: 90%;
		max-width: 480px;
		padding: 2rem;
		border: 1px solid #222;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
	}

	.modal-header {
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.logo {
		font-size: 3rem;
		margin-bottom: 0.5rem;
	}

	.modal-header h1 {
		font-size: 1.75rem;
		color: #10B981;
		margin: 0;
	}

	.subtitle {
		color: #888;
		margin: 0.25rem 0 0;
	}

	.step-indicator {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}

	.step-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #333;
		transition: all 0.3s;
	}

	.step-dot.active {
		background: #10B981;
		transform: scale(1.2);
	}

	.step-dot.completed {
		background: #10B981;
	}

	.step-content {
		text-align: center;
	}

	.step-content h2 {
		color: #fff;
		margin-bottom: 1.5rem;
	}

	.feature-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 2rem;
		text-align: left;
	}

	.feature {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		background: #1a1a1a;
		border-radius: 12px;
	}

	.feature .icon {
		font-size: 1.5rem;
	}

	.feature strong {
		color: #fff;
		display: block;
	}

	.feature p {
		color: #888;
		margin: 0.25rem 0 0;
		font-size: 0.875rem;
	}

	.status-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.status-item {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		background: #1a1a1a;
		border-radius: 8px;
		text-align: left;
	}

	.status-icon {
		font-size: 1.5rem;
	}

	.status-item strong {
		color: #fff;
	}

	.status-item p {
		color: #888;
		margin: 0.25rem 0 0;
		font-size: 0.875rem;
	}

	.progress-bar {
		height: 8px;
		background: #222;
		border-radius: 4px;
		margin-bottom: 1rem;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #10B981, #059669);
		transition: width 0.3s;
	}

	.error-message {
		background: rgba(239, 68, 68, 0.1);
		color: #ef4444;
		padding: 0.75rem;
		border-radius: 8px;
		margin-bottom: 1rem;
		font-size: 0.875rem;
	}

	.help-box {
		background: #1a1a1a;
		padding: 1rem;
		border-radius: 8px;
		text-align: left;
		margin-bottom: 1rem;
	}

	.help-box p {
		color: #fff;
		margin: 0 0 0.75rem;
	}

	.help-box ol {
		color: #888;
		margin: 0;
		padding-left: 1.25rem;
	}

	.help-box li {
		margin-bottom: 0.5rem;
	}

	.help-box a {
		color: #10B981;
	}

	.primary-btn {
		width: 100%;
		padding: 1rem;
		background: #10B981;
		color: #fff;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}

	.primary-btn:hover {
		background: #059669;
	}

	.primary-btn:disabled {
		background: #333;
		cursor: not-allowed;
	}

	.secondary-btn {
		padding: 0.75rem 1rem;
		background: #333;
		color: #fff;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		margin-top: 0.75rem;
	}

	.secondary-btn:hover {
		background: #444;
	}

	.skip-btn {
		background: none;
		border: none;
		color: #666;
		cursor: pointer;
		margin-top: 1rem;
		font-size: 0.875rem;
	}

	.skip-btn:hover {
		color: #888;
	}

	.ready-message {
		margin: 2rem 0;
	}

	.ready-message p {
		color: #888;
		font-size: 1.125rem;
	}

	.tips {
		background: #1a1a1a;
		padding: 1.25rem;
		border-radius: 12px;
		text-align: left;
		margin-bottom: 1.5rem;
	}

	.tips h3 {
		color: #fff;
		margin: 0 0 0.75rem;
		font-size: 0.875rem;
	}

	.tips ul {
		margin: 0;
		padding-left: 1.25rem;
		color: #888;
	}

	.tips li {
		margin-bottom: 0.5rem;
	}

	.tips kbd {
		background: #333;
		padding: 0.125rem 0.5rem;
		border-radius: 4px;
		font-family: monospace;
		font-size: 0.75rem;
	}

	.modal-footer {
		margin-top: 1.5rem;
		text-align: center;
	}

	.back-btn {
		background: none;
		border: none;
		color: #888;
		cursor: pointer;
	}

	.back-btn:hover {
		color: #fff;
	}
</style>
