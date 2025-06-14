
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
				// Enhanced nature-inspired color palette
				nature: {
					'forest': '#2D5E40',
					'leaf': '#4A7856',
					'moss': '#8BA888',
					'sage': '#9CAF88',
					'mist': '#E8F2E8',
					'bark': '#5E4B3E',
					'earth': '#8A6552',
					'sky': '#6B9AC4',
					'stone': '#54585A',
					'cream': '#F4EBD9',
					'emerald': '#50C878',
					'jade': '#00A86B',
					'pine': '#355E3B',
					'olive': '#808000',
				}
			},
			fontFamily: {
				'inter': ['Inter', 'sans-serif'],
				'playfair': ['Playfair Display', 'serif'],
			},
			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1rem' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'base': ['1rem', { lineHeight: '1.5rem' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1' }],
				'6xl': ['3.75rem', { lineHeight: '1' }],
				'7xl': ['4.5rem', { lineHeight: '1' }],
				'8xl': ['6rem', { lineHeight: '1' }],
				'9xl': ['8rem', { lineHeight: '1' }],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'waveform': {
					'0%, 100%': { transform: 'scaleY(0.3)', opacity: '0.6' },
					'50%': { transform: 'scaleY(1)', opacity: '1' }
				},
				'fade-in': {
					from: { opacity: '0', transform: 'translateY(10px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-up': {
					from: { opacity: '0', transform: 'translateY(30px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-down': {
					from: { opacity: '0', transform: 'translateY(-30px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-left': {
					from: { opacity: '0', transform: 'translateX(-30px)' },
					to: { opacity: '1', transform: 'translateX(0)' }
				},
				'fade-in-right': {
					from: { opacity: '0', transform: 'translateX(30px)' },
					to: { opacity: '1', transform: 'translateX(0)' }
				},
				'scale-in': {
					from: { opacity: '0', transform: 'scale(0.9)' },
					to: { opacity: '1', transform: 'scale(1)' }
				},
				'scale-out': {
					from: { opacity: '1', transform: 'scale(1)' },
					to: { opacity: '0', transform: 'scale(0.9)' }
				},
				'slide-in-right': {
					from: { transform: 'translateX(100%)' },
					to: { transform: 'translateX(0)' }
				},
				'slide-out-right': {
					from: { transform: 'translateX(0)' },
					to: { transform: 'translateX(100%)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' }
				},
				'float-light': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'float-strong': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-30px)' }
				},
				'glow': {
					'0%': { boxShadow: '0 0 20px rgba(45, 94, 64, 0.5)' },
					'100%': { boxShadow: '0 0 40px rgba(45, 94, 64, 0.8)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'gradient': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				'rotate-y': {
					'0%, 100%': { transform: 'rotateY(0deg)' },
					'50%': { transform: 'rotateY(180deg)' }
				},
				'bounce-slow': {
					'0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
					'50%': { transform: 'none', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'waveform': 'waveform 1.2s ease-in-out infinite',
				'fade-in': 'fade-in 0.5s ease-out',
				'fade-in-up': 'fade-in-up 0.6s ease-out',
				'fade-in-down': 'fade-in-down 0.6s ease-out',
				'fade-in-left': 'fade-in-left 0.6s ease-out',
				'fade-in-right': 'fade-in-right 0.6s ease-out',
				'scale-in': 'scale-in 0.5s ease-out',
				'scale-out': 'scale-out 0.5s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-out-right': 'slide-out-right 0.3s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'float-light': 'float-light 8s ease-in-out infinite',
				'float-strong': 'float-strong 4s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite alternate',
				'shimmer': 'shimmer 3s linear infinite',
				'gradient': 'gradient 3s ease infinite',
				'rotate-y': 'rotate-y 2s ease-in-out infinite',
				'bounce-slow': 'bounce-slow 2s infinite',
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'spin-slow': 'spin 3s linear infinite',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'nature-overlay': 'linear-gradient(to right, rgba(45, 94, 64, 0.9), rgba(74, 120, 86, 0.7))',
				'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
				'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
			},
			backdropBlur: {
				'xs': '2px',
				'3xl': '64px',
			},
			boxShadow: {
				'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
				'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.3)',
				'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
				'glow': '0 0 20px rgba(45, 94, 64, 0.5)',
				'glow-lg': '0 0 40px rgba(45, 94, 64, 0.8)',
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
