/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        figma: {
          bg: '#1E1E1E',
          surface: '#2C2C2C',
          border: '#3C3C3C',
          hover: '#383838',
          text: '#FFFFFF',
          'text-secondary': '#B3B3B3',
          accent: '#0D99FF',
          success: '#14AE5C',
          warning: '#F24822',
          purple: '#7B61FF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'figma': '0 2px 14px rgba(0, 0, 0, 0.15)',
        'figma-lg': '0 8px 32px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}
