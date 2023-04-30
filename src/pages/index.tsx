/* eslint-disable */
import { type NextPage } from "next";
import Head from "next/head";
import { Navbar } from "@/components";
import { FaSearch } from "react-icons/fa";
import { useRef } from "react";
import { xor, isUrl } from "@/components";
import { useRouter } from "next/router";
import Script from "next/script";
const Home: NextPage = () => {
  const router = useRouter();
  const input = useRef<HTMLInputElement | null>(null);

  const Search = async () => {
    if (input.current?.value === "") return;
    let url = input.current?.value;
    if (!isUrl(url)) url = `https://search.brave.com/search?q=${url}`;
    else if (!(url?.startsWith("https://") || url?.startsWith("http://")))
      url = `http://${url}`;
    url = xor.encode(url);
    await router
      .push({
        pathname: `/service`,
        query: { q: url },
      })
      .catch((err) => console.error(err))
      .then(() => console.log("this will succeed"))
      .catch(() => "obligatory catch");
  };

  return (
    <>
      <Head>
        <title>Emerald | Home</title>
        <meta name="description" content="A Delusions production" />
        <link rel="shortcut icon" href="/emerald.png" type="image/png" />
      </Head>

      <main className="flex h-screen w-full items-center justify-center ">
        <Navbar />
        {/* Search bar */}
        <div
          onClick={() => input.current?.focus()}
          className="flex w-[26rem] items-center rounded-md border-[1px] border-white text-primary-100 "
        >
          <FaSearch className="mx-2 text-xl" />
          <input
            ref={input}
            type="text"
            className="w-96 border-0 bg-transparent p-2 text-base outline-none"
            placeholder="https://google.com"
            onKeyDown={(e) => {
              if (e.key === "Enter") Search();
            }}
          />
        </div>
      </main>
    </>
  );
};

export default Home;
