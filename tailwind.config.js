/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}

// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '300px', // Changed from 640px to 480px
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
}
