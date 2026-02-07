import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	
	// Tauri 개발 서버 설정
	server: {
		port: 1420,
		strictPort: true,
		watch: {
			ignored: ['**/src-tauri/**']
		}
	},

	// 빌드 최적화
	build: {
		target: 'esnext',
		minify: 'esbuild'
	}
});
