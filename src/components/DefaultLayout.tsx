import Head from 'next/head';
import type { ReactNode } from 'react';

type DefaultLayoutProps = { children: ReactNode };

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
    return (
        <>
            <Head>
                <title>Hangman</title>
                <link href="/favicon-light.svg" rel="icon" media="(prefers-color-scheme: light)" />
                <link href="/favicon-dark.svg" rel="icon" media="(prefers-color-scheme: dark)" />
            </Head>

            <main className="h-screen">{children}</main>
        </>
    );
};
