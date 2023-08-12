import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const profileRouter = createTRPCRouter({
  findUserByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          name: input.username,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      return user;
    }),
  getUserByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.userId,
        },
      });

      // if (!user) {
      //   throw new TRPCError({
      //     code: "INTERNAL_SERVER_ERROR",
      //     message: "User not found",
      //   });
      // }

      return user;
    }),
  getStarsByUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const stars = await ctx.prisma.star.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
        post: {
          include: {
            author: true,
            likes: true,
            stars: true
          }
        },
      }
    });

    return stars;
  }),
  getUserByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { username } = input;
      const user = await ctx.prisma.user.findFirst({
        where: {
          name: username,
        },
      });

      if (!user) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      return user;
    }),
  changeBio: protectedProcedure
    .input(
      z.object({
        text: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const bio = await ctx.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          bio: input.text,
        },
      });

      return bio;
    }),
  changeProfilePicture: protectedProcedure
    .input(z.object({
      currentUser: z.string(),
      newImage: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (userId !== input.currentUser) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await ctx.prisma.user.update({
        where: {
          id: userId
        },
        data: {
          image: input.newImage
        }
      });
    }),
  checkUsername: protectedProcedure
    .input(z.object({
      newUsername: z.string().min(3).max(10),
    }))
    .query(async ({ ctx, input }) => {
      const existingUsername = await ctx.prisma.user.findFirst({
        where: {
          name: input.newUsername
        }
      });

      if (existingUsername) {
        return false;
      }

      return true;
    }),
  changeUsername: protectedProcedure
    .input(z.object({
      newUsername: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      await ctx.prisma.user.update({
        where: {
          id: userId
        },
        data: {
          name: input.newUsername
        }
      })
    })
});
