/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./**/*.html"],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#ffffff',
        zinc: {
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        },
        gray: {
          400: '#9ca3af',
        },
        
        brand: {
          black: '#000000',
          white: '#ffffff',
        },
        neutral: {
          300: '#d4d4d8',  // text-zinc-300
          400: '#a1a1aa',  // text-zinc-400
          800: '#27272a',  // border-zinc-800
          900: '#18181b',  // bg-zinc-900
        }
      },
      
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'Inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      
      fontSize: {
        '15vw': '15vw',
        '12vw': '12vw',
        '10vw': '10vw',
        
        'hero-mobile': '15vw',
        'hero-tablet': '12vw',
        'hero-desktop': '10vw',
      },
      
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      
      animation: {
        'bounce': 'bounce 1s infinite',
      },
    },
  },
  plugins: [],
}