/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        hearst: {
          green: '#10b981',
          blue: '#3b82f6',
          amber: '#d97706',
        },
      },
    },
  },
  plugins: [],
}

