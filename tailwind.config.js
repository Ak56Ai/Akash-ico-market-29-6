/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom Dark Mode Colors
        'dark': {
          'bg': '#1A1A1A',        // Rich black background
          'text': '#F0F0F0',      // Off-white text
          'accent1': '#004D61',   // Dark teal
          'accent2': '#822659',   // Deep ruby
          'button': '#3E5641',    // Forest green
        },
        // Custom Light Mode Colors
        'light': {
          'bg': '#2C2C2C',        // Slate gray background
          'text': '#E4E4E4',      // Light gray text
          'accent1': '#A8DADC',   // Light cyan
          'accent2': '#FFC1CC',   // Soft pink
          'button': '#B39CD0',    // Lavender
        },
        // Custom Ultra Dark Mode Colors
        'ultra': {
          'bg': '#0D0D0D',        // Almost black
          'text': '#FFFFFF',      // Pure white
          'accent1': '#00FF85',   // Neon green
          'accent2': '#1E90FF',   // Electric blue
          'hover': '#FF0099',     // Vivid pink
        },
        // Enhanced Primary Colors
        'primary': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        'secondary': {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
        'accent': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'dark-gradient': 'linear-gradient(135deg, #1A1A1A 0%, #004D61 50%, #822659 100%)',
        'light-gradient': 'linear-gradient(135deg, #2C2C2C 0%, #A8DADC 50%, #FFC1CC 100%)',
        'ultra-gradient': 'linear-gradient(135deg, #0D0D0D 0%, #00FF85 50%, #1E90FF 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 255, 133, 0.3)',
        'glow-md': '0 0 30px rgba(30, 144, 255, 0.4)',
        'glow-lg': '0 0 40px rgba(255, 0, 153, 0.5)',
        'dark-glow': '0 0 20px rgba(0, 77, 97, 0.4)',
        'light-glow': '0 0 20px rgba(168, 218, 220, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 255, 133, 0.2), 0 0 10px rgba(0, 255, 133, 0.2), 0 0 15px rgba(0, 255, 133, 0.2)' },
          '100%': { boxShadow: '0 0 10px rgba(0, 255, 133, 0.4), 0 0 20px rgba(0, 255, 133, 0.4), 0 0 30px rgba(0, 255, 133, 0.4)' },
        },
      },
    },
  },
  plugins: [],
};