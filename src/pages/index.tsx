import Head from "next/head";
import Posts from "../components/randomTest";
import { Layout } from "../components/layout";
import type { NextPageWithAuthLayout } from "src/utils/types";
import { useSession } from "next-auth/react";

const Home: NextPageWithAuthLayout = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>The Art Nest...For the people, by the people.</title>
        <meta
          name="description"
          content="An open source social web application for artists"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex flex-col items-center justify-center gap-4"></div>

        <Posts />
      </main>
    </>
  );
};

Home.auth = true

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default Home

