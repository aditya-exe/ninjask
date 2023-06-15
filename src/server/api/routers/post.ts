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

      try {
        const post = await ctx.prisma.post.create({
          data: {
            authorId,
            text: input.text,
          },
        });

        if (!post) {
          throw new TRPCError({
            message: "Error creating a post",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        return post;
      } catch (err) {
        throw new TRPCError({
          message: "Something went wrong",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
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
  getAllByUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        where: {
          authorId: input.userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return posts;
    }),
  isBookmarked: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      try {
        const post = await ctx.prisma.bookmark.findFirst({
          where: {
            userId,
            postId: input.postId,
          },
        });

        if (!post) {
          return false;
        }
        return true;
      } catch (err) {
        throw new TRPCError({
          message: "Something went wrong",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  unstarPost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      try {
        const existingStar = await ctx.prisma.bookmark.findFirst({
          where: {
            userId,
            postId: input.postId,
          },
        });

        if (!existingStar) {
          throw new TRPCError({
            message: "You have not starred this post",
            code: "BAD_REQUEST",
          });
        }

        await ctx.prisma.bookmark.delete({
          where: {
            id: existingStar.id,
          },
        });

        return {
          success: true,
        };
      } catch (err) {
        throw new TRPCError({
          message: "Unable to delete star",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  likePost: protectedProcedure
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
            userId,
            postId: input.postId,
          },
        });

        if (existingLike) {
          throw new TRPCError({
            message: "You have already liked this post",
            code: "BAD_REQUEST",
          });
        }

        const like = await ctx.prisma.like.create({
          data: {
            userId,
            postId: input.postId,
          },
        });

        return like;
      } catch (err) {
        throw new TRPCError({
          message: "Failed to add like",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  unlikePost: protectedProcedure
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
            userId,
            postId: input.postId,
          },
        });

        if (!existingLike) {
          throw new TRPCError({
            message: "You have not liked this post",
            code: "BAD_REQUEST",
          });
        }

        await ctx.prisma.like.delete({
          where: {
            id: existingLike.id,
          },
        });

        return {
          success: true,
        };
      } catch (err) {
        return new TRPCError({
          message: "Failed to remove like",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  isLiked: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      try {
        const existingLike = await ctx.prisma.like.findFirst({
          where: {
            userId,
            postId: input.postId,
          },
        });

        if (!existingLike) {
          return false;
        }

        return true;
      } catch (err) {
        throw new TRPCError({
          message: "Something went wrong",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
