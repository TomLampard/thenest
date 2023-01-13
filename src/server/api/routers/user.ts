import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  viewProfile: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      try {
        const user = await ctx.prisma.user.findUnique({
          where: { id },
          select: {
            id: true,
            nickname: true,
            avatar: {
              select: {
                filename: true,
              },
            },
            bio: true,
          }
        })
        return user 
      } catch {
        new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Massive fail, the world must be ending, tRPC can't even spit out a public query sheesshh."})
      }
    }),
  
  getProfile: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      try {
        const user = await ctx.prisma.user.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            nickname: true,
            image: true,
            bio: true,
            posts: true,
            comments: true,
            likedPosts: {
              select: {
                post: true,
              },
            },
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `No Profile found for user id "${id}"`,
          });
        }
        return user;
      } catch {
        new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something has gone wrong with tRPC query",
        });
      }
    }),
  editProfile: protectedProcedure
    .input(
      z.object({
        data: z.object({
          nickname: z.string({
            required_error: "Nickname is required for all users",
          }),
          bio: z.string().max(1100).nullish(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.prisma.user.update({
          where: { id: ctx.session.user.id },
          data: {
            nickname: input.data.nickname,
            bio: input.data.bio,
          },
        });
        return user;
      } catch {
        new TRPCError({ code: "BAD_REQUEST" });
      }
    }),
  updateAvatar: protectedProcedure.input(
    z.object({
      filename: z.string(),
    })
  ).mutation(async ({ ctx, input }) => {
    try {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id},
        data: {
          image: input.filename,
        }
      })
      return user;
    } catch {
      new TRPCError({ code: "BAD_REQUEST"})
    }
  })
});
