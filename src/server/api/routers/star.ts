// import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";

export const starRouter = createTRPCRouter({
  toggleStar: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      try {
        const existingStar = await ctx.prisma.star.findFirst({
          where: {
            userId,
            postId: input.postId,
          },
        });

        if (existingStar) {
          return await ctx.prisma.star.delete({
            where: {
              userId_postId: {
                userId,
                postId: input.postId,
              },
            },
          });
        } else {
          return await ctx.prisma.star.create({
            data: {
              userId,
              postId: input.postId,
            },
          });
        }
      } catch (err) {}
    }),
  countStarsByPostId: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const postId = input.postId;

      const stars = await ctx.prisma.star.count({
        where: {
          postId,
        },
      });

      return stars;
    }),
  isStarred: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const postId = input.postId;
      const userId = ctx.session.user.id;

      const star = await ctx.prisma.star.findFirst({
        where: {
          userId,
          postId,
        },
      });

      if (!star) {
        return false;
      }

      return true;
    }),
});
