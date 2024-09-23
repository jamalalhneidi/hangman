import Head from 'next/head';
import type { ReactNode } from 'react';

type DefaultLayoutProps = { children: ReactNode };

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
    return (
        <>
            <Head>
                <title>Hangman</title>
                <link rel="icon" href="/favicon.svg" />
            </Head>

            <main className="h-screen">{children}</main>
        </>
    );
};
