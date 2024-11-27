/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        ripple: {
          '0%': {
            boxShadow: '0 0 0 0 rgba(255, 221, 51, 0.7)', // Bắt đầu từ viền với bóng mờ
          },
          '100%': {
            boxShadow: '0 0 10px 20px rgba(255, 221, 51, 0)', // Tỏa ra ngoài và mờ dần
          },
        },
      },
      animation: {
        ripple: 'ripple 2s infinite', // Lặp lại hiệu ứng mỗi 2s
      },
    },
  },
  plugins: [],
}