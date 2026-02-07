/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: '#e74c3c',
				'primary-hover': '#c0392b',
				bg: '#1a1a2e',
				surface: '#16213e',
				text: '#eaeaea',
				muted: '#888'
			}
		}
	},
	plugins: []
};
