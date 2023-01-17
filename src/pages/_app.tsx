import { type AppProps } from "next/app";
import type { ReactNode } from "react";
import type { NextPageWithAuthLayout } from "src/utils/types";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { api } from "../utils/api";

import "../styles/globals.css";

type NextAppWithAuthLayout = AppProps & {
  Component: NextPageWithAuthLayout;
};

function NestApp({ Component, pageProps }: NextAppWithAuthLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider>
      <ThemeProvider>
        {Component.auth ? (
          <Auth>{getLayout(<Component {...pageProps} />)}</Auth>
        ) : (
          getLayout(<Component {...pageProps} />)
        )}
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  );
}

export default api.withTRPC(NestApp);

export const Auth = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const isUser = !!session?.user;
  useEffect(() => {
    if (status === "loading") return;
    if (!isUser) {
      signIn("discord");
    }
  }, [isUser, status]);

  if (isUser) {
    return <>{children}</>;
  }
  return null;
};
