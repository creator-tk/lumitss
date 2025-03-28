
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
			clipPath: {
        wave: "polygon(0% 60%, 25% 80%, 50% 60%, 75% 80%, 100% 60%, 100% 100%, 0% 100%)",
      },
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
			keyframes:{
				flip:{
				'0%, 100%': { transform: 'rotateX(0deg)', opacity: '1' }, 
				'50%': { transform: 'rotateX(180deg)', opacity: '0' },
				},

				flipTop: {
					'0%, 100%': { transform: 'rotateX(0deg)', opacity: '1' }, 
					'50%': { transform: 'rotateX(-180deg)', opacity: '0' },
				}, 

				flipBottom:{
					'0%, 100%': { transform: 'rotateX(0deg)', opacity: '1' }, 
					'50%': { transform: 'rotateX(180deg)', opacity: '0' },
				}
			},
			animation:{
				flip: 'flip 1s infinite linear', flipTop: 'flipTop 1s infinite linear', flipBottom: 'flipBottom 1s infinite linear',
			}
  	}
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar-hide")],
};

export default config
