import { type NextPage } from "next";
import CreatePost from "../components/forms/createPost";
import Head from "next/head";

const Home: NextPage = () => {
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
        <CreatePost />
      </main>
    </>
  );
};

export default Home;
