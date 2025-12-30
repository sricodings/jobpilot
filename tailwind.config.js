/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    950: '#020c1b', // Main background
                    900: '#0a192f', // Sidebar / Secondary background
                    800: '#112240', // Card background
                    700: '#233554', // Borders / Hover
                    600: '#384c70', // Muted text
                    100: '#ccd6f6', // Primary text
                    50: '#8892b0',  // Secondary text
                },
                cyan: {
                    400: '#64ffda', // Primary accent
                    500: '#00e5ff', // Hover accent
                    900: 'rgba(100, 255, 218, 0.1)', // Tint
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
