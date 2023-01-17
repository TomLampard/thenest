import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { CreatePostSchema } from "../../../schema/postSchema";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

const defaultPostSelect = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  title: true,
  content: true,
  author: {
    select: {
      id: true,
      nickname: true,
      image: true,
    },
  },
  authorId: true,
  file: {
    select: {
      id: true,
      filename: true,
    },
  },
  fileId: true,
  hidden: true,
  createdAt: true,
  updatedAt: true,
  comments: {
    select: {
      id: true,
      content: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          nickname: true,
          image: true,
        },
      },
    },
  },
  likedBy: {
    select: {
      id: true,
    },
  },
});

export const postRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      select: defaultPostSelect,
      orderBy: {
        createdAt: "desc",
      },
    });
    return posts;
  }),

  getAllPosts: publicProcedure.query(async ({ ctx }) => {
    try {
      const posts = ctx.prisma.post.findMany({
        select: defaultPostSelect,

        orderBy: {
          createdAt: "desc",
        },
      });
      return posts;
    } catch {
      new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),

  feedPosts: protectedProcedure
    .input(CreatePostSchema)
    .query(async ({ ctx, input }) => {
      const where = {
        authorId: input?.author,
      };
      try {
        const posts = await ctx.prisma.post.findMany({
          select: defaultPostSelect,
          orderBy: {
            createdAt: "desc",
          },
        });
        const postCount = await ctx.prisma.post.count({
          where,
        });
        return {
          posts,
          postCount,
        };
      } catch {
        new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  findPost: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const post = await ctx.prisma.post.findUnique({
          where: {
            id: input.id,
          },
          select: defaultPostSelect,
        });
        return {
          title: post?.title,
          id: post?.id,
          content: post?.content,
          file: post?.file?.filename,
        };
      } catch {
        new TRPCError({ code: "NOT_FOUND" });
      }
    }),

  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const posts = await ctx.prisma.post.findMany({
          take: 10,
          where: {
            hidden: false,
            title: { search: input.query },
            content: { search: input.query },
          },
          select: defaultPostSelect,
        });
        return {
          posts,
        };
      } catch {
        new TRPCError({ code: "NOT_FOUND" });
      }
    }),

  findPostByAuthor: protectedProcedure
    .input(
      z.object({
        authorId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const posts = await ctx.prisma.post.findMany({
          where: {
            authorId: input.authorId,
          },
          select: defaultPostSelect,
        });
        return posts;
      } catch {
        new TRPCError({ code: "NOT_FOUND" });
      }
    }),

  findPostByUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const posts = await ctx.prisma.post.findMany({
          select: defaultPostSelect,
          where: {
            authorId: input.userId,
          },
        });
        return posts;
      } catch {
        new TRPCError({ code: "NOT_FOUND" });
      }
    }),

  createPost: publicProcedure
    .input(CreatePostSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const postId = randomUUID();

      try {
        const post = await ctx.prisma.post.create({
          data: {
            id: postId,
            title: input.title,
            content: input.content,
            authorId: userId,
            fileId: input.file,
          },
        });
        return post;
      } catch {
        new TRPCError({ code: "BAD_REQUEST" });
      }
    }),

  editPost: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        data: z.object({
          content: z
            .string({ required_error: "Post description text is required" })
            .min(4)
            .max(1100),
          file: z.string({
            required_error:
              "Your post needs a cool image or short video uploaded",
          }),
          title: z
            .string({
              required_error: "Post title text is required",
            })
            .min(2)
            .max(254),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      try {
        const post = await ctx.prisma.post.findUnique({
          where: { id },
          select: {
            author: {
              select: {
                id: true,
              },
            },
          },
        });

        const postBelongsToUser = post?.author.id === ctx.session.user.id;

        if (!postBelongsToUser) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const updatedPost = await ctx.prisma.post.update({
          where: { id },
          data: {
            title: data.title,
            content: data.content,
            file: {
              connect: {
                filename: data.file,
              },
            },
          },
        });

        return updatedPost;
      } catch {
        new TRPCError({ code: "BAD_REQUEST" });
      }
    }),

  deletePost: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      try {
        const post = await ctx.prisma.post.findUnique({
          where: { id },
          select: {
            author: {
              select: {
                id: true,
              },
            },
          },
        });

        const postBelongsToUser = post?.author.id === ctx.session.user.id;

        if (!postBelongsToUser) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await ctx.prisma.post.delete({
          where: {
            id,
          },
        });
        return id;
      } catch {
        new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
});
