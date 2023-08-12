// import { TRPCError } from "@trpc/server";
// import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
// import { z } from "zod";

// export const commentRouter = createTRPCRouter({
//   create: protectedProcedure
//     .input(
//       z.object({
//         userId: z.string(),
//         postId: z.string(),
//         text: z.string().min(1).max(60),
//       })
//     )
//     .mutation(async ({ ctx, input }) => {
//       const comment = await ctx.prisma.comment.create({
//         data: {
//           authorId: input.userId,
//           text: input.text,
//           postId: input.postId,
//         },
//       });

//       return comment;
//     }),
//   getAll: publicProcedure
//     .input(
//       z.object({
//         postId: z.string(),
//       })
//     )
//     .query(async ({ ctx, input }) => {
//       const comments = await ctx.prisma.comment.findMany({
//         where: {
//           postId: input.postId,
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//         include: {
//           author: true,
//         },
//       });

//       return comments;
//     }),
//   deleteCommentById: protectedProcedure
//     .input(
//       z.object({
//         commentId: z.string(),
//         authorId: z.string(),
//       })
//     )
//     .mutation(async ({ ctx, input }) => {
//       if (ctx.session.user.id !== input.authorId) {
//         throw new TRPCError({
//           code: "BAD_REQUEST",
//           message: "UNAUTHORIZED",
//         });
//       }

//       const deletedComment = await ctx.prisma.comment.delete({
//         where: {
//           id: input.commentId,
//         },
//       });

//       return deletedComment;
//     }),
//   countComments: publicProcedure
//     .input(
//       z.object({
//         postId: z.string(),
//       })
//     )
//     .query(async ({ ctx, input }) => {
//       const postId = input.postId;

//       const comments = await ctx.prisma.comment.count({
//         where: {
//           postId,
//         },
//       });

//       return comments;
//     }),
// });
