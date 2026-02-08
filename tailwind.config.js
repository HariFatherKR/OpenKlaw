/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				// Dubai Crab style colors (두바이 쫀득 쿠키 테마)
				primary: {
					DEFAULT: '#4a7c59',
					hover: '#3d6b4f',
					dark: '#2d5a3f',
					light: '#6b9b7a',
					50: '#e8f5e9',
					100: '#c8e6c9',
					500: '#4a7c59',
					600: '#3d6b4f',
					700: '#2d5a3f'
				},
				secondary: {
					DEFAULT: '#5D4037',
					light: '#795548',
					dark: '#4E342E',
					darker: '#3E2723'
				},
				accent: {
					DEFAULT: '#D4A574',
					light: '#E8C9A0',
					dark: '#C49A6C',
					golden: '#B8860B'
				},
				
				// Dark chocolate backgrounds
				bg: {
					DEFAULT: '#3E2723',
					light: '#4E342E',
					card: 'rgba(74, 124, 89, 0.15)'
				},
				
				// Glass morphism (피스타치오 그린)
				glass: {
					bg: 'rgba(74, 124, 89, 0.2)',
					border: 'rgba(74, 124, 89, 0.3)',
					hover: 'rgba(74, 124, 89, 0.3)'
				},
				
				// Text colors (cream/white for dark theme)
				text: {
					DEFAULT: '#FFF8E1',
					secondary: '#D7CCC8',
					muted: '#BCAAA4'
				},
				
				// Status colors
				success: '#81C784',
				warning: '#FFB74D',
				error: '#E57373',
				info: '#64B5F6'
			},
			borderRadius: {
				'2xl': '1rem',
				'3xl': '1.5rem',
				'4xl': '2rem'
			},
			boxShadow: {
				'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
				'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.4)',
				'glass-hover': '0 12px 40px rgba(0, 0, 0, 0.35)',
				'glow': '0 0 20px rgba(212, 165, 116, 0.3)',
				'glow-lg': '0 0 40px rgba(212, 165, 116, 0.4)',
				'soft': '0 2px 8px rgba(0, 0, 0, 0.2)'
			},
			backdropBlur: {
				'xs': '2px',
				'3xl': '64px'
			},
			fontFamily: {
				sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
			},
			backgroundImage: {
				'gradient-chocolate': 'linear-gradient(135deg, #3E2723 0%, #4E342E 25%, #5D4037 50%, #4E342E 75%, #3E2723 100%)',
				'gradient-pistachio': 'linear-gradient(135deg, #2d5a3f 0%, #3d6b4f 50%, #4a7c59 100%)',
				'gradient-golden': 'linear-gradient(135deg, #D4A574, #B8860B)'
			}
		}
	},
	plugins: []
};
