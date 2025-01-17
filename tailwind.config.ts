import type { Config } from 'tailwindcss';
import { PluginAPI } from 'tailwindcss/types/config';

const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette');


const config = {
	darkMode: ["class"],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	prefix: "",
	theme: {
		container: {
			center: 'true',
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					light: '#65F6C1',
					main: '#18E299',
					dark: '#12201B'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				neutral: {
					100: '#040505',
					90: '#080909',
					80: '#0D1211',
					70: '#212E2B',
					60: '#384247',
					50: '#9BA9B0',
					40: '#BBC2C7',
					30: '#D4DADD',
					20: '#F1F0F3',
					10: '#FFFFFF'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				move: {
					'0%': {
						transform: 'translateX(-200px)'
					},
					'100%': {
						transform: 'translateX(200px)'
					}
				},
				gradient: {
					to: {
						backgroundPosition: 'var(--bg-size) 0'
					}
				},
				meteor: {
					'0%': {
						transform: 'rotate(215deg) translateX(0)',
						opacity: '1'
					},
					'70%': {
						opacity: '1'
					},
					'100%': {
						transform: 'rotate(215deg) translateX(-500px)',
						opacity: '0'
					}
				},
				float: {
					'0%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-100px)'
					},
					'100%': {
						transform: 'translateY(0px)'
					}
				},
				rotate: {
					'0%': {
						transform: 'rotate(0deg)'
					},
					'50%': {
						transform: 'rotate(40deg)'
					},
					'100%': {
						transform: 'rotate(-40deg)'
					}
				},
				shine: {
					'0%': {
						'background-position': '0% 0%'
					},
					'50%': {
						'background-position': '100% 100%'
					},
					to: {
						'background-position': '0% 0%'
					}
				},
				floating: {
					'0%, 100%': {
						transform: 'translate(0, 0) rotate(0deg)'
					},
					'50%': {
						transform: 'translate(-10px, -10px) rotate(3deg)'
					}
				},
				'border-beam': {
					'100%': {
						'offset-distance': '100%'
					}
				},
				marquee: {
					from: {
						transform: 'translateX(0)'
					},
					to: {
						transform: 'translateX(calc(-100% - var(--gap)))'
					}
				},
				'marquee-vertical': {
					from: {
						transform: 'translateY(0)'
					},
					to: {
						transform: 'translateY(calc(-100% - var(--gap)))'
					}
				}
			},
			animation: {
				move: 'move 5s linear infinite',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				gradient: 'gradient 8s linear infinite',
				float: 'float 6s linear infinite',
				floating: 'floating 6s ease-in-out infinite',
				rotate: 'rotate 6s linear infinite',
				meteor: 'meteor 5s linear infinite',
				shine: 'shine var(--duration) infinite linear',
				'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
				marquee: 'marquee var(--duration) infinite linear',
				'marquee-vertical': 'marquee-vertical var(--duration) linear infinite'
			}
		}
	},
	plugins: [require('tailwindcss-animate'),
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