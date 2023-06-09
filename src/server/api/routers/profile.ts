import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { cx } from "class-variance-authority";

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

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      return user;
    }),
  getStarsByUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const stars = await ctx.prisma.bookmark.findMany({
      where: {
        userId,
      },
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

      // if (!user) {
      //   return new TRPCError({ code: "BAD_REQUEST" });
      // }

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
});
