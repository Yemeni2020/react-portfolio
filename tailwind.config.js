// /** @type {import('tailwindcss').Config} */
// module.exports = {
//     darkMode: "class",
//     content: ["./index.html", "./src/**/*.{ts,tsx}"],
//     theme: {
//         extend: {
//             fontFamily: {
//                 sans: [
//                     "ui-sans-serif",
//                     "system-ui",
//                     "-apple-system",
//                     "Segoe UI",
//                     "Roboto",
//                     "Inter",
//                     "Noto Sans",
//                     "Ubuntu",
//                     "Cantarell",
//                     "Helvetica Neue",
//                     "Arial",
//                     "sans-serif"
//                 ]
//             },
//             boxShadow: {
//                 soft: "0 8px 30px rgba(0,0,0,0.06)"
//             }
//         }
//     },
//     plugins: []
// };

export default {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    "ui-sans-serif",
                    "system-ui",
                    "-apple-system",
                    "Segoe UI",
                    "Roboto",
                    "Inter",
                    "Noto Sans",
                    "Ubuntu",
                    "Cantarell",
                    "Helvetica Neue",
                    "Arial",
                    "sans-serif"
                ]
            },
            boxShadow: {
                soft: "0 8px 30px rgba(0,0,0,0.06)"
            }
        }
    },
    plugins: []
};
