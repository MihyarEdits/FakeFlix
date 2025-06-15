/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: '#e50914',
          black: '#141414',
          gray: {
            100: '#f8f8f8',
            200: '#e5e5e5',
            300: '#cccccc',
            400: '#999999',
            500: '#666666',
            600: '#333333',
            700: '#1a1a1a',
            800: '#0f0f0f',
            900: '#000000'
          }
        }
      },
      fontFamily: {
        'sans': ['Helvetica Neue', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(229, 9, 20, 0.5)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
};