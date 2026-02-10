/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}', './index.html'],
  theme: {
    extend: {
      colors: {
        // Dubai Crab dark chocolate + kadaif theme
        'crab-dark': '#3E2723',
        'crab-medium': '#4E342E',
        'crab-light': '#5D4037',
        'crab-accent': '#8D6E63',
        'crab-text': '#EFEBE9',
        'crab-muted': '#BCAAA4',
        'crab-orange': '#C9A86C',  // 골드 블렌드 (카다이프)
        'crab-gold': '#D4A574'     // 밝은 골드
      }
    }
  },
  plugins: []
};
