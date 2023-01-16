import type { NextPage } from "next";
import type { User } from "@prisma/client";
import type { ReactElement, ReactNode } from "react";

export type NextPageWithAuthLayout = NextPage & {
  auth?: boolean;
  getLayout?: (page: ReactElement) => ReactNode;
};

export type Author = Pick<User, "id" | "nickname" | "image">;
