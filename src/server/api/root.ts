import { profileRouter } from "./routers/profile";
import { createTRPCRouter } from "@/server/api/trpc";
import { postRouter } from "./routers/post";
import { likeRouter } from "./routers/like";
import { starRouter } from "./routers/star";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  profile: profileRouter,
  like: likeRouter,
  star: starRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
