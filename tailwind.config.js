/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#1D4ED8",
                secondary: "#64748B",
                accent: "#F59E0B",
            },
        },
    },
    plugins: [],
}