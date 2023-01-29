import Head from "next/head";
import { Layout } from "../components/layout";
import type { NextPageWithAuthLayout } from "src/utils/types";

const Home: NextPageWithAuthLayout = () => {

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
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="justify-center gap-4 text-2xl font-semibold">
            Welcome to The Nest...
          </h2>
        </div>
      </main>
    </>
  );
};

Home.auth = true;

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
