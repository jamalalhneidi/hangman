import { useEffect, useState } from 'react';
import Hangman from '~/components/Hangman';
import { alphabet } from '~/utils/alphabet';
import { MAX_WRONG_GUESSES } from '~/utils/consts';
import { trpc } from '../utils/trpc';
import type { NextPageWithLayout } from './_app';

const IndexPage: NextPageWithLayout = () => {
    const { data } = trpc.word.randomWord.useQuery();
    const word = data?.word ?? '';

    const { guesses, wrongGuesses, over, restart } = useGuessHandler(word);
    return (
        <div className="flex justify-between items-center h-screen w-3/4 mx-auto p-4 bg-primary-dark">
            <div className="flex-1 flex flex-col justify-center items-center h-full">
                <div className="relative">
                    <div className="w-full h-16 my-4">
                        {over && <span className="block w-fit mx-auto text-primary-dark text-3xl">Game Over!</span>}
                    </div>
                    <div className="flex flex-wrap">
                        {word.split('').map((c, i) => (
                            <div key={i} className="h-12 flex flex-col items-center px-1 text-3xl">
                                {c !== ' ' ? (
                                    <>
                                        <span className="flex-1 text-primary-dark">{guesses.includes(c) ? c : ''}</span>
                                        <div className="w-8 h-0.5 mt-2 bg-secondary-dark" />
                                    </>
                                ) : (
                                    <span className="p-2"></span>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-16 w-full">
                        <button
                            onClick={restart}
                            className="block mx-auto p-4 text-white hover:bg-gray-500 active:bg-gray-600 border rounded"
                        >
                            Restart (<kbd>Enter</kbd>)
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <Hangman wrongGuesses={wrongGuesses} />
                <div className="grid grid-cols-3 justify-center mt-8 h-32">
                    {guesses
                        .filter((c) => !word.includes(c))
                        .map((c, i) => (
                            <div
                                key={i}
                                className="w-12 h-12 flex items-center justify-center text-2xl text-red-600 border border-red-600 rounded-md mx-1 my-1"
                            >
                                {c}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

const useGuessHandler = (word: string) => {
    const [guesses, setGuesses] = useState<string[]>([]);
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [over, setOver] = useState(false);

    const restart = () => {
        setGuesses([]);
        setWrongGuesses(0);
        setOver(false);
    };

    useEffect(() => {
        const correctGuessHandler = (c: string) => {
            setGuesses((prv) => [...prv, c]);
        };

        const wrongGuessHandler = (c: string) => {
            if (over) return;
            setGuesses((prv) => [...prv, c]);
            setWrongGuesses((prv) => prv + 1);
        };

        const listener = (e: KeyboardEvent) => {
            const c = e.key.toLowerCase();
            if (c === 'enter') {
                restart();
                return;
            }
            if (over) return;
            if (!alphabet.english.includes(c) || guesses.includes(c)) return;
            if (word.includes(c)) correctGuessHandler(c);
            else wrongGuessHandler(c);
        };

        document.addEventListener('keydown', listener);
        return () => {
            document.removeEventListener('keydown', listener);
        };
    }, [word, guesses, wrongGuesses, over]);

    // max wrong guesses reached
    useEffect(() => {
        if (wrongGuesses === MAX_WRONG_GUESSES) setOver(true);
    }, [wrongGuesses]);

    // word guessed
    useEffect(() => {
        if (!word.length) return;
        let done = true;
        for (const c of word) done &&= c == ' ' || guesses.includes(c);
        if (done) setOver(true);
    }, [word, guesses]);

    return { guesses, wrongGuesses, over, restart };
};

export default IndexPage;

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @link https://trpc.io/docs/v11/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createServerSideHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.post.all.fetch();
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
