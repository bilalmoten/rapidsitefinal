import type { Config } from 'tailwindcss';
import { PluginAPI } from 'tailwindcss/types/config';

const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette');

const config: Config = {
  // darkMode: 'class', // Enable dark mode using class
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        move: {
          '0%': { transform: 'translateX(-200px)' },
          '100%': { transform: 'translateX(200px)' },
        },
      },
      animation: {
        move: 'move 5s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      colors: {
        // Extend the color palette if needed
      },
    },
  },
  plugins: [
    // require('daisyui'),
    require('tailwindcss-animate'),
    addVariablesForColors,
  ],
};

export default config;

function addVariablesForColors({ addBase, theme }: PluginAPI) {
  const allColors = theme('colors') as Record<string, string>;

  // Convert colors to CSS variables
  const newVars: Record<string, string> = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ':root': newVars,
    // Add dark mode variables
    '.dark': {
      ...Object.fromEntries(
        Object.entries(newVars).map(([key, val]) => [`--${key}-dark`, val])
      ),
    },
  });
}
