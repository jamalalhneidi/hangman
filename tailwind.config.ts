import flowbite from 'flowbite-react/tailwind';
import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: 'class',
    content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}', flowbite.content()],
    theme: {
        extend: {
            colors: {
                primary: 'var(--primary)',
                'primary-content': 'var(--primary-content)',
                'primary-dark': 'var(--primary-dark)',
                'primary-light': 'var(--primary-light)',
                secondary: 'var(--secondary)',
                'secondary-content': 'var(--secondary-content)',
                'secondary-dark': 'var(--secondary-dark)',
                'secondary-light': 'var(--secondary-light)',
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                border: 'var(--border)',
                copy: 'var(--copy)',
                'copy-light': 'var(--copy-light)',
                'copy-lighter': 'var(--copy-lighter)',
                success: 'var(--success)',
                warning: 'var(--warning)',
                error: 'var(--error)',
                'success-content': 'var(--success-content)',
                'warning-content': 'var(--warning-content)',
                'error-content': 'var(--error-content)',
            },
        },
    },
    plugins: [flowbite.plugin()],
};

export default config;
