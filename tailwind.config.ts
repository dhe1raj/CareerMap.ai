
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
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
					foreground: 'hsl(var(--primary-foreground))'
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Enhanced neon purple theme colors
				brand: {
					100: "#eee6ff",
					200: "#d9ccff",
					300: "#c2adff",
					400: "#a17bf5", // Primary neon purple
					500: "#8a65e3", // Vibrant purple
					600: "#724dc9", // Deep purple
					700: "#5a3b9f", // Rich purple
					800: "#3d2875", // Dark purple
					900: "#20174c",  // Very dark purple/blue
					950: "#1a1033"   // Darkest background purple
				},
				cyber: {
					purple: "#a855f7",
					glow: "#c084fc",
					dark: "#1a1a2e",
					deeper: "#0f0f1b",
					midnight: "#080818"
				}
			},
			fontFamily: {
				'poppins': ['Poppins', 'sans-serif'],
				'space': ['"Space Grotesk"', 'sans-serif']
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
				'fade-in': {
					from: { opacity: '0', transform: 'translateY(10px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in': {
					from: { transform: 'translateY(20px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'pulse-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 10px rgba(168, 85, 247, 0.5), 0 0 20px rgba(192, 132, 252, 0.3)' 
					},
					'50%': { 
						boxShadow: '0 0 15px rgba(168, 85, 247, 0.7), 0 0 25px rgba(192, 132, 252, 0.5)' 
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-15px)' }
				},
				'glow-pulse': {
					'0%, 100%': { 
						textShadow: '0 0 8px rgba(168, 85, 247, 0.7), 0 0 12px rgba(168, 85, 247, 0.5)' 
					},
					'50%': { 
						textShadow: '0 0 12px rgba(168, 85, 247, 0.9), 0 0 20px rgba(168, 85, 247, 0.7)' 
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-in-out',
				'slide-in': 'slide-in 0.7s ease-out',
				'pulse-glow': 'pulse-glow 3s infinite',
				'float': 'float 6s ease-in-out infinite',
				'glow-pulse': 'glow-pulse 2s infinite'
			},
			backdropFilter: {
				'none': 'none',
				'blur': 'blur(15px)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
