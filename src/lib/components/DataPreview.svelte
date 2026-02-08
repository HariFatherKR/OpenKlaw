<script lang="ts">
	import type { SpreadsheetData } from '$lib/skills/spreadsheet';

	interface Props {
		data: SpreadsheetData;
		onAnalyze?: () => void;
	}

	let { data, onAnalyze }: Props = $props();

	// 최대 표시 컬럼 수
	const MAX_VISIBLE_COLS = 6;
	const visibleHeaders = $derived(data.headers.slice(0, MAX_VISIBLE_COLS));
	const hasMoreCols = $derived(data.headers.length > MAX_VISIBLE_COLS);
</script>

<div class="data-preview">
	<div class="preview-header">
		<span class="file-icon">
			{#if data.fileType === 'csv'}
				📊
			{:else}
				📗
			{/if}
		</span>
		<div class="file-info">
			<span class="file-name">{data.fileName}</span>
			<span class="file-meta">
				{data.totalRows.toLocaleString()}행 × {data.totalColumns}열
				{#if data.sheetName}
					· {data.sheetName}
				{/if}
			</span>
		</div>
	</div>

	<div class="table-wrapper">
		<table>
			<thead>
				<tr>
					{#each visibleHeaders as header}
						<th>{header}</th>
					{/each}
					{#if hasMoreCols}
						<th class="more-cols">+{data.headers.length - MAX_VISIBLE_COLS}</th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each data.rows as row, i}
					<tr>
						{#each visibleHeaders as header}
							<td>{row[header] ?? ''}</td>
						{/each}
						{#if hasMoreCols}
							<td class="more-cols">...</td>
						{/if}
					</tr>
				{/each}
				{#if data.totalRows > data.rows.length}
					<tr class="more-rows">
						<td colspan={visibleHeaders.length + (hasMoreCols ? 1 : 0)}>
							... {(data.totalRows - data.rows.length).toLocaleString()}행 더 있음
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>

	{#if onAnalyze}
		<button class="analyze-btn" onclick={onAnalyze}>
			🔍 데이터 분석하기
		</button>
	{/if}
</div>

<style>
	.data-preview {
		background: var(--color-surface);
		border-radius: 0.75rem;
		overflow: hidden;
		margin: 0.5rem 0;
		max-width: 100%;
	}

	.preview-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		background: rgba(0, 0, 0, 0.2);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.file-icon {
		font-size: 1.5rem;
	}

	.file-info {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.file-name {
		font-weight: 600;
		font-size: 0.95rem;
	}

	.file-meta {
		font-size: 0.8rem;
		color: var(--color-text-muted);
	}

	.table-wrapper {
		overflow-x: auto;
		max-height: 300px;
		overflow-y: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.85rem;
	}

	th,
	td {
		padding: 0.5rem 0.75rem;
		text-align: left;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
		white-space: nowrap;
		max-width: 200px;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	th {
		background: rgba(0, 0, 0, 0.1);
		font-weight: 600;
		position: sticky;
		top: 0;
	}

	tr:hover td {
		background: rgba(255, 255, 255, 0.03);
	}

	.more-cols {
		color: var(--color-text-muted);
		font-style: italic;
		text-align: center;
	}

	.more-rows td {
		text-align: center;
		color: var(--color-text-muted);
		font-style: italic;
	}

	.analyze-btn {
		width: 100%;
		padding: 0.75rem;
		background: var(--color-primary);
		border: none;
		color: white;
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}

	.analyze-btn:hover {
		background: var(--color-primary-hover);
	}
</style>
