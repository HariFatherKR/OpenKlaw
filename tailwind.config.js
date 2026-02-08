/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				// Dubai Crab - Soft UI Evolution + Glassmorphism (Dark Mode)
				// WCAG AA+ compliant colors
				primary: {
					DEFAULT: '#10B981',
					hover: '#059669',
					dark: '#047857',
					light: '#34D399',
					50: '#ECFDF5',
					100: '#D1FAE5',
					200: '#A7F3D0',
					500: '#10B981',  // 메인 에메랄드 그린
					600: '#059669',
					700: '#047857'
				},
				secondary: {
					DEFAULT: '#44403C',
					light: '#78716C',
					dark: '#292524',
					darker: '#1C1917',
					50: '#FAFAF9',
					100: '#F5F5F4',
					700: '#44403C',
					800: '#292524',
					900: '#1C1917'  // 배경용
				},
				accent: {
					DEFAULT: '#F59E0B',
					light: '#FBBF24',
					dark: '#D97706',
					golden: '#F59E0B',
					400: '#FBBF24',
					500: '#F59E0B',
					600: '#D97706'
				},
				
				// Dark backgrounds
				bg: {
					DEFAULT: '#1C1917',
					light: '#292524',
					card: 'rgba(16, 185, 129, 0.1)'
				},
				
				// Glass morphism (Pistachio Green - improved)
				glass: {
					bg: 'rgba(16, 185, 129, 0.1)',
					border: 'rgba(16, 185, 129, 0.2)',
					hover: 'rgba(16, 185, 129, 0.15)'
				},
				
				// Text colors (cream/white for dark theme)
				text: {
					DEFAULT: '#FAFAF9',
					secondary: '#A8A29E',
					muted: '#78716C'
				},
				
				// Status colors
				success: '#22C55E',
				warning: '#FBBF24',
				error: '#EF4444',
				info: '#3B82F6'
			},
			borderRadius: {
				'lg': '8px',
				'xl': '12px',
				'2xl': '16px',
				'3xl': '20px',
				'4xl': '24px'
			},
			boxShadow: {
				'soft': '0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -2px rgba(0,0,0,0.3)',
				'soft-lg': '0 10px 15px -3px rgba(0,0,0,0.3), 0 4px 6px -4px rgba(0,0,0,0.3)',
				'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
				'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.5)',
				'glass-hover': '0 12px 40px rgba(0, 0, 0, 0.45)',
				'glow': '0 0 20px rgba(16, 185, 129, 0.3)',
				'glow-lg': '0 0 40px rgba(16, 185, 129, 0.4)',
				'glow-accent': '0 0 20px rgba(245, 158, 11, 0.3)'
			},
			backdropBlur: {
				'xs': '2px',
				'3xl': '64px'
			},
			fontFamily: {
				sans: ['Pretendard', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif']
			},
			backgroundImage: {
				'gradient-dark': 'linear-gradient(135deg, #1C1917 0%, #292524 50%, #1C1917 100%)',
				'gradient-primary': 'linear-gradient(135deg, #047857 0%, #059669 50%, #10B981 100%)',
				'gradient-accent': 'linear-gradient(135deg, #D97706, #F59E0B, #FBBF24)'
			},
			transitionDuration: {
				'250': '250ms',
				'300': '300ms'
			}
		}
	},
	plugins: []
};
