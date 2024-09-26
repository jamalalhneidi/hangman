import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

const words: string[] = fs
    .readFileSync(path.join(__dirname, '..', '..', '..', '..', '..', 'words.txt'))
    .toString()
    .split('\r\n');

const wordRouter = router({
    randomWord: publicProcedure
        .input(z.object({ limit: z.number().min(1).max(50).default(50) }))
        .query(async ({ input }) => {
            const res = [];
            for (let i = 0; i < input.limit; i++) {
                res.push(words[Math.floor(Math.random() * words.length)]);
            }
            return { words: res as string[] };
        }),
});

export default wordRouter;
