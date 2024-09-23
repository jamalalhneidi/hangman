import { publicProcedure, router } from '../trpc';

const wordRouter = router({
    randomWord: publicProcedure.query(async () => {
        // if (process.env.NODE_ENV !== 'production')
        console.log('word router');

        return { word: 'development' };
        // const { data } = await axios.get('https://api.api-ninjas.com/v1/randomword', {
        // headers: {
        // 'X-Api-Key': process.env.API_KEY,
        // },
        // params: {},
        // });
        // return { word: (data as { word: string[] }).word[0] };
    }),
});

export default wordRouter;
