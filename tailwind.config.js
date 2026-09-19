/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chase: {
          blue: '#134e32',      // Hunter Green primary
          navy: '#0b2b1a',      // Dark Forest Green dark primary
          light: '#f2f7f4',     // Soft vintage tint
          mid: '#1d6e47',       // Medium Pine Green
          border: '#d2e3d8',    // Soft sage border
        },
        vintage: {
          green: '#0f3823',     // Dark Hunter Green
          darkGreen: '#071d12', // Deep Forest
          lightGreen: '#1b5235',// Mid Forest Accent
          gold: '#d4af37',      // Vintage Gold Accent
          goldDark: '#aa7c11',  // Antique Gold Shadow
          goldLight: '#f3e5ab', // Soft Gold Tint
          cream: '#fdfbf7',     // Parchment Cream
          paper: '#f6f2e9',     // Warm Vintage Paper
          textDark: '#1c241f',  // Rich Dark Text
          border: '#d2c8b8',    // Antique Gold / Linen Border
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'vintage-gradient': 'linear-gradient(135deg, #0b2b1a 0%, #164a30 50%, #071d12 100%)',
        'gold-gradient': 'linear-gradient(135deg, #f7e7b4 0%, #d4af37 50%, #996515 100%)',
        'paper-texture': 'linear-gradient(to bottom, #fdfbf7, #f6f2e9)',
      }
    },
  },
  plugins: [],
}
