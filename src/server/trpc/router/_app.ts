import { router } from "../trpc";
import { exampleRouter } from "./example";
import { scrapeRouter } from "./scrape";

export const appRouter = router({
  example: exampleRouter,
  scrape: scrapeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
