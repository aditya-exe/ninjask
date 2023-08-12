// import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";

export const likeRouter = createTRPCRouter({
  toggleLike: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      try {
        const existingLike = await ctx.prisma.like.findFirst({
          where: {
            postId: input.postId,
            userId,
          },
        });

        if (existingLike) {
          return await ctx.prisma.like.delete({
            where: {
              userId_postId: {
                userId,
                postId: input.postId,
              },
            },
          });
        } else {
          return await ctx.prisma.like.create({
            data: {
              userId,
              postId: input.postId,
            },
          });
        }
      } catch (err) {}
    }),
  countLikesByPostId: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const postId = input.postId;

      const likes = await ctx.prisma.like.count({
        where: {
          postId,
        },
      });

      return likes;
    }),
  isLiked: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const like = await ctx.prisma.like.findFirst({
        where: {
          postId: input.postId,
          userId,
        },
      });

      if (!like) {
        return false;
      }

      return true;
    }),
});
