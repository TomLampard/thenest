import { z } from "zod";

export const CreatePostSchema = z.object({
  content: z
    .string({
      required_error: "Post description is required",
    })
    .min(10)
    .max(280),
  title: z
    .string({
      required_error: "Post title is required",
    })
    .min(2)
    .max(75),

  file: z.object({
    connect: z.object({
      filename: z.string(),
    })
  }),

  filename: z.string(),

  author: z.object({
    connect: z.object({
      id: z.string(),
    }),
  }),
});
