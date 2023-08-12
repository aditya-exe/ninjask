import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

// TODO Error handling

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        text: z.string().min(1),
        parentPostId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.session.user.id;
      const { text, parentPostId } = input;

      try {
        const post = await ctx.prisma.post.create({
          data: {
            authorId,
            text,
            parentPost: parentPostId,
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
    try {
      const posts = await ctx.prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          likes: true,
          author: true,
          stars: true,
        },
      });

      return posts;
    } catch (err) {
      if (err instanceof TRPCError) {
        throw new TRPCError({
          code: err.code,
          message: err.message,
        });
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong :/",
      });
    }
  }),
  deleteByPostId: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        authorId: z.string(),
        parentPost: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { postId, authorId, parentPost } = input;

      if (ctx.session.user.id !== authorId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "UNAUTHORIZED",
        });
      }

      const deletedPost = await ctx.prisma.post.delete({
        where: {
          id: postId,
          parentPost,
        },
      });

      return deletedPost;
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
        include: {
          likes: true,
          author: true,
          stars: true,
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
        include: {
          likes: true,
          author: true,
          stars: true,
        },
      });

      return posts;
    }),
  getInitialPosts: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        likes: true,
        author: true,
        stars: true,
      },
      take: 3,
    });

    if (posts.length === 0) {
      return [];
    }

    return posts;
  }),
  createChild: protectedProcedure
    .input(
      z.object({
        parentPostId: z.string(),
        text: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { parentPostId, text } = input;
      const userId = ctx.session.user.id;

      const child = await ctx.prisma.post.create({
        data: {
          authorId: userId,
          text,
          parentPost: parentPostId,
        },
      });

      return child;
    }),
  getAllChildren: publicProcedure
    .input(
      z.object({
        parentPostId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { parentPostId } = input;

      const children = await ctx.prisma.post.findMany({
        where: {
          parentPost: parentPostId,
        },
        include: {
          likes: true,
          stars: true,
          author: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return children;
    }),
  countChildren: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { postId } = input;
      const children = await ctx.prisma.post.count({
        where: {
          parentPost: postId,
        },
      });

      return children;
    }),
});
