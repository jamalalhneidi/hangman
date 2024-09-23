import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: 'class',
    content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            // TODO
            textColor: {
                primary: {
                    DEFAULT: 'black',
                    dark: '#E5E7EB',
                },
            },
            backgroundColor: {
                primary: {
                    DEFAULT: 'white',
                    dark: '#1F2937',
                },
                secondary: {
                    DEFAULT: '#1F2937',
                    dark: '#86878a',
                },
            },
        },
    },
    plugins: [],
};

export default config;
