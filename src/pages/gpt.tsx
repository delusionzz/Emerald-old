/* eslint-disable */
import React, { useState, useEffect } from "react";
import type { ChatCompletionRequestMessage } from "openai";
import axios from "axios";
import Head from "next/head";
import { MdExitToApp as Exit } from "react-icons/md";
import Link from "next/link";
import Script from "next/script";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Gpt = () => {
  const input = React.useRef<HTMLInputElement>(null);
  const [disabled, setDisabled] = useState(false);
  const [control, setControl] = useState<string>();
  const [conversation, SetConversation] = useState<
    ChatCompletionRequestMessage[]
  >([
    {
      role: "system",
      content:
        "You are EmeraldGPT. A highly advanced AI model trained on everything."
    }
  ]);

  useEffect(() => {
    (async () => {
      try {
        if (
          conversation[conversation.length - 1]?.role === "assistant" ||
          conversation[conversation.length - 1]?.role === "system"
        )
          return;
        setDisabled(true);
        const { data, status } = await axios.post("/api/generate", {
          messages: JSON.stringify(conversation)
        });
        if (status === 200) {
          setDisabled(false);
          SetConversation([
            ...(conversation as ChatCompletionRequestMessage[]),
            {
              role: "assistant",
              content: data.result as string
            }
          ]);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (
            error.response?.status === 400 &&
            error.response.data === "Too much tokens"
          ) {
            toast.error("Please shorten your message.");
            setDisabled(false);
          } else if (
            error.response?.status === 429 &&
            error.response.data.message === "The request has been rate limited."
          ) {
            toast.error("You are being rate limited, try again later");
            setDisabled(false);
          } else if (
            error.response?.status === 400 &&
            error.response.data.error.message === "Please enter a valid message"
          ) {
            toast.error(
              "Woops looks like something went wrong with your message. Please try again"
            );
            setDisabled(false);
          }
        }
      }
    })();
  }, [conversation]);

  const generateResponse = async () => {
    if (control) {
      try {
        SetConversation((prev) => [
          ...prev,
          {
            role: "user",
            content: control
          }
        ]);
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <>
      <Head>
        <title>Emerald GPT</title>
        <Script
          async
          data-cfasync="false"
          src="//broadsheetspikesnick.com/d61cfab1aa5829b5619cb48e7fd02089/invoke.js"
        ></Script>
      </Head>
      <div className="flex h-screen w-full flex-col items-center justify-center pb-10">
        <div className="text- absolute right-5 top-5">
          <Link href={"/"}>
            <button className="rounded-md bg-primary-400 p-2 text-3xl text-white transition-all hover:bg-primary-600">
              <Exit />
            </button>
          </Link>
        </div>

        <div className="h-full w-7/12 space-y-5 overflow-y-auto rounded-md bg-primary-500 px-5 py-3">
          {Array.isArray(conversation) &&
            conversation.map((convo, i) => {
              if (convo.role === "system") return;
              return (
                <div key={i} className={`flex flex-col text-lg`}>
                  <h1
                    className={`${
                      convo.role === "assistant"
                        ? "font-bold text-white"
                        : "text-primary-200"
                    }`}
                  >
                    {convo.role === "assistant" ? "EmeraldGPT" : "User"}:
                  </h1>
                  <p
                    className={`flex flex-wrap text-base ${
                      convo.role === "assistant"
                        ? "text-primary-100"
                        : "text-primary-100"
                    } `}
                  >
                    {convo.content}
                  </p>
                </div>
              );
            })}
        </div>
        <input
          type="text"
          className="w-6/12 rounded-md border-[1px] border-primary-100 bg-transparent p-2 text-primary-200 outline-none"
          placeholder="who won the 2010 world cup?"
          ref={input}
          disabled={disabled}
          onChange={(e) => setControl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") generateResponse();
          }}
        />
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default Gpt;
