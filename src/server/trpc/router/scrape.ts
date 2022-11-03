import { z } from "zod";

import { router, publicProcedure } from "../trpc";

import { span5 } from "../../../utils/conjugate";

export const scrapeRouter = router({
  conjugate: publicProcedure
    .input(z.object({ verb: z.string() }))
    .query(async({ input }) => {
      return await span5(input.verb);
    }),
});
