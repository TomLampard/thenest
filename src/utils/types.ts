import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";

export type NextPageWithAuthLayout = NextPage & {
  auth?: boolean;
  getLayout?: (page: ReactElement) => ReactNode;
};
