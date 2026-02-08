/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				// CoachPro style colors
				primary: {
					DEFAULT: '#14b8a6',
					hover: '#0d9488',
					light: '#5eead4'
				},
				secondary: '#06b6d4',
				accent: '#5eead4',
				
				// Background
				bg: {
					DEFAULT: '#0f172a',
					light: '#1e293b',
					card: 'rgba(255, 255, 255, 0.08)'
				},
				
				// Legacy support
				surface: '#16213e',
				
				// Text
				text: {
					DEFAULT: 'rgba(255, 255, 255, 0.95)',
					secondary: 'rgba(255, 255, 255, 0.7)',
					muted: 'rgba(255, 255, 255, 0.5)'
				}
			},
			borderRadius: {
				'2xl': '1rem',
				'3xl': '1.5rem',
				'4xl': '2rem'
			},
			boxShadow: {
				'glass': '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
				'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
				'glow': '0 0 20px rgba(20, 184, 166, 0.3)',
				'glow-lg': '0 0 40px rgba(20, 184, 166, 0.4)'
			},
			backdropBlur: {
				'xs': '2px',
				'3xl': '64px'
			},
			fontFamily: {
				sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
			}
		}
	},
	plugins: []
};
