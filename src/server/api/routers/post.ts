import { TRPCError } from "@trpc/server";
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
    const posts = await ctx.prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return posts;
  }),
  deleteByPostId: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        authorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.id !== input.authorId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "UNAUTHORIZED",
        });
      }

      const deletedPost = await ctx.prisma.post.delete({
        where: {
          id: input.postId,
        },
      });

      return deletedPost;
    }),
  starPost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        authorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const star = await ctx.prisma.bookmark.create({
        data: {
          postId: input.postId,
          userId,
          authorId: input.authorId,
        },
      });

      return star;
    }),
  getPostById: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.postId,
        },
      });

      return post;
    }),
});
