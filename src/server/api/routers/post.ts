import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        text: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.session.user.id;

      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          text: input.text,
        },
      });

      return post;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany();
    return posts;
  }),
});
