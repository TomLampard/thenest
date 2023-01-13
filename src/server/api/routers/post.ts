import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const postRouter = createTRPCRouter({
  getAllPosts: publicProcedure.query(async ({ ctx }) => {
    try {
      const posts = await ctx.prisma.post.findMany({
        select: {
          id: true,
          title: true,
          author: {
            select: {
              id: true,
              nickname: true,
              userAvatar: true,
            },
          },
          content: true,
          contentHtml: true,
          createdAt: true,
          updatedAt: true,
          file: {
            select: {
              filename: true,
            },
          },
          comments: true,
          likedBy: {
            orderBy: {
              createdAt: "asc",
            },
            select: {
              user: {
                select: {
                  id: true,
                  nickname: true,
                  userAvatar: true,
                },
              },
            },
          },
        },

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
    .input(
      z.object({
        take: z.number().min(1).max(50).optional(),
        skip: z.number().min(1).optional(),
        authorId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const take = input?.take ?? 50;
      const skip = input?.skip;
      const where = {
        authorId: input?.authorId,
      };
      try {
        const posts = await ctx.prisma.post.findMany({
          select: {
            id: true,
            title: true,
            content: true,
            contentHtml: true,
            file: {
              select: {
                filename: true,
              },
            },
            createdAt: true,
            updatedAt: true,
            hidden: true,
            author: {
              select: {
                id: true,
                nickname: true,
                userAvatar: true,
              },
            },
            comments: {
              select: {},
            },
            likedBy: {
              orderBy: {
                createdAt: "asc",
              },
              select: {
                user: {
                  select: {
                    id: true,
                    nickname: true,
                    userAvatar: true,
                  },
                },
              },
            },
            _count: {
              select: {
                comments: true,
              },
            },
          },
          take,
          skip,
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
          select: {
            id: true,
            title: true,
            author: {
              select: {
                id: true,
                nickname: true,
                userAvatar: true,
              },
            },
            content: true,
            contentHtml: true,
            createdAt: true,
            updatedAt: true,
            file: {
              select: {
                filename: true,
              },
            },
            comments: {
              orderBy: {
                createdAt: "asc",
              },
            },
            likedBy: {
              orderBy: {
                createdAt: "asc",
              },
              select: {
                user: {
                  select: {
                    id: true,
                    nickname: true,
                    userAvatar: true,
                  },
                },
              },
            },
          },
        });
        return post;
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
          select: {
            id: true,
            title: true,
            file: {
              select: {
                filename: true,
              },
            },
            likedBy: {
              orderBy: {
                createdAt: "asc",
              },
              select: {
                user: {
                  select: {
                    id: true,
                    nickname: true,
                    userAvatar: true,
                  },
                },
              },
            },
          },
        });
        return posts;
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
          select: {
            id: true,
            title: true,
            author: {
              select: {
                id: true,
                nickname: true,
                userAvatar: true,
              },
            },
            content: true,
            contentHtml: true,
            createdAt: true,
            updatedAt: true,
            file: true,
            comments: true,
            likedBy: {
              orderBy: {
                createdAt: "asc",
              },
              select: {
                user: {
                  select: {
                    id: true,
                    nickname: true,
                    userAvatar: true,
                  },
                },
              },
            },
          },
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
          select: {
            id: true,
            title: true,
            author: {
              select: {
                id: true,
                nickname: true,
                userAvatar: true,
              },
            },
            content: true,
            contentHtml: true,
            createdAt: true,
            updatedAt: true,
            file: true,
            comments: true,
            likedBy: {
              orderBy: {
                createdAt: "asc",
              },
              select: {
                user: {
                  select: {
                    id: true,
                    nickname: true,
                    userAvatar: true,
                  },
                },
              },
            },
          },
          where: {
            authorId: input.userId,
          },
        });
        return posts;
      } catch {
        new TRPCError({ code: "NOT_FOUND" });
      }
    }),

  createPost: protectedProcedure
    .input(
      z.object({
        description: z
          .string({
            required_error: "Post description text is required",
          })
          .min(4)
          .max(1100),
        filename: z.string({
          required_error: "file Id for post file is requied",
        }),
        title: z
          .string({
            required_error: "Post title text is required",
          })
          .min(2)
          .max(254),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      try {
        const post = await ctx.prisma.post.create({
          data: {
            title: input.title,
            file: {
              connect: {
                id: input.filename,
              },
            },
            content: input.description,
            author: {
              connect: {
                id: userId,
              },
            },
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
