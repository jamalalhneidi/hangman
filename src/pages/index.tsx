import { Spinner } from 'flowbite-react';
import { useCallback, useEffect, useState } from 'react';
import Hangman from '~/components/Hangman';
import { alphabet } from '~/utils/alphabet';
import { MAX_WRONG_GUESSES } from '~/utils/consts';
import { trpc } from '../utils/trpc';
import type { NextPageWithLayout } from './_app';

const IndexPage: NextPageWithLayout = () => {
    const { guesses, wrongCounter, over, restart, freebie, word, isFetching } = useGameHandler();
    return (
        <div className="flex justify-between items-center h-screen w-3/4 mx-auto p-4">
            <div className="flex-1 flex flex-col justify-center items-center h-full">
                <div className="relative">
                    <div className="w-full h-16 my-4">
                        {isFetching && <Spinner className="block mx-auto fill-primary" size="xl" />}
                        {over && !isFetching && (
                            <span className="block w-fit mx-auto text-3xl text-copy">Game Over!</span>
                        )}
                    </div>
                    <div className="flex flex-wrap">
                        {word.split('').map((c, i) => (
                            <div key={i} className="h-12 flex flex-col items-center px-1 text-3xl">
                                {c !== ' ' ? (
                                    <>
                                        <span className="flex-1">{guesses.includes(c) ? c : ''}</span>
                                        <div className="w-8 h-0.5 mt-2 bg-primary" />
                                    </>
                                ) : (
                                    <span className="p-2"></span>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-16 w-full flex justify-center items-center">
                        <button
                            disabled={isFetching}
                            onClick={restart}
                            className="mx-4 p-4 border broder-border text-primary-content bg-primary hover:disabled:bg-primary hover:bg-primary-light disabled:cursor-not-allowed rounded"
                        >
                            Restart (<kbd>Enter</kbd>)
                        </button>
                        <button
                            disabled={isFetching}
                            onClick={freebie}
                            className="text-sm p-2 mx-4 my-auto border broder-border text-secondary-content bg-secondary hover:bg-secondary-light rounded"
                        >
                            Freebie <br />(<kbd>Ctrl + H</kbd>)
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <Hangman wrongCounter={wrongCounter} />
                <div className="grid grid-cols-3 justify-center mt-8 h-32">
                    {guesses
                        .filter((c) => !word.includes(c))
                        .map((c, i) => (
                            <div
                                key={i}
                                className="w-12 h-12 flex items-center justify-center text-2xl text-error border-error border rounded-md mx-1 my-1"
                            >
                                {c}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

const useGameHandler = () => {
    const [guesses, setGuesses] = useState<string[]>([]);
    const [wrongCounter, setWrongGuesses] = useState(0);
    const [over, setOver] = useState(false);
    const [words, setWords] = useState<string[]>([]);
    const [word, setWord] = useState<string>('');
    const [limit, setLimit] = useState(49);
    const { data, refetch, isFetching, isLoading } = trpc.word.randomWord.useQuery(
        { limit },
        {
            refetchOnWindowFocus: false,
        },
    );

    useEffect(() => {
        if (!isLoading) setLimit(1);
    }, [isLoading]);

    useEffect(() => {
        setWords((prv) => [...prv, ...(data?.words ?? [])]);
    }, [data]);

    useEffect(() => {
        setWord(words[0] ?? '');
        if (words.length < 50) refetch();
    }, [refetch, words]);

    const nextWord = useCallback(() => {
        setWords((prv) => prv.slice(1));
    }, []);

    const restart = useCallback(() => {
        if (isFetching) return;
        setGuesses([]);
        setWrongGuesses(0);
        setOver(false);
        nextWord();
    }, [isFetching, nextWord]);

    const freebie = useCallback(() => {
        for (const c of word) {
            if (guesses.includes(c)) continue;
            setGuesses((prv) => [...prv, c]);
            return;
        }
    }, [guesses, word]);

    // listener
    useEffect(() => {
        if (isFetching) return;
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
            if (e.ctrlKey && c == 'h') {
                e.preventDefault();
                freebie();
                return;
            }
            if (over) return;
            if (!alphabet.includes(c) || guesses.includes(c)) return;
            if (word.includes(c)) correctGuessHandler(c);
            else wrongGuessHandler(c);
        };

        document.addEventListener('keydown', listener);
        return () => {
            document.removeEventListener('keydown', listener);
        };
    }, [word, guesses, wrongCounter, over, restart, isFetching, freebie]);

    // max wrong guesses reached
    useEffect(() => {
        if (wrongCounter === MAX_WRONG_GUESSES) setOver(true);
    }, [wrongCounter]);

    // word guessed
    useEffect(() => {
        if (!word.length) return;
        let done = true;
        for (const c of word) done &&= c == ' ' || guesses.includes(c);
        if (done) setOver(true);
    }, [word, guesses]);

    // reveal answer on game over
    useEffect(() => {
        if (!over) return;
        let t = 0;
        for (const c of new Set(word.split(''))) {
            if (guesses.includes(c)) continue;
            setTimeout(() => {
                setGuesses((prv) => [...prv, c]);
            }, (t += 100));
        }
    }, [guesses, over, word]);

    return { guesses, wrongCounter, over, word, isFetching, restart, freebie };
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
