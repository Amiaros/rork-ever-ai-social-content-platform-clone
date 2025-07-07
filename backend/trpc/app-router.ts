import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import generateContentRoute from "./routes/content/generate";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  content: createTRPCRouter({
    generate: generateContentRoute,
  }),
});

export type AppRouter = typeof appRouter;