/* eslint-disable */
import NavSearch from "@/components/NavSearch";
import { useEffect, useState } from "react";
import type { GetServerSideProps, NextPage } from "next";
const Service: NextPage<{ query: string }> = ({ query }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);
  return (
    <div className="relative flex h-screen w-full flex-col">
      <NavSearch />
      <div className="h-full w-full">
        <div className="flex h-full w-full">
          {loading ? (
            <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
              <h1 className="text-4xl">Loading ultraviolet...</h1>
            </div>
          ) : null}
          <iframe
            width={"100%"}
            className={loading ? `hidden` : `border-none`}
            height="100%"
            src={`/uv/${query}`}
          ></iframe>
        </div>
      </div>
    </div>
  );
};
/*eslint require-await: "off"*/
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      query: context.query.q,
    },
  };
};

export default Service;
