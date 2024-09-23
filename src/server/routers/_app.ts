/**
 * This file contains the root router of your tRPC-backend
 */
import { createCallerFactory, publicProcedure, router } from '../trpc';
import wordRouter from './word';

export const appRouter = router({
    healthcheck: publicProcedure.query(() => 'yay!'),

    word: wordRouter,
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
