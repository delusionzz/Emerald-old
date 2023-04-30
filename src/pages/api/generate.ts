/* eslint-disable */

import { Configuration, OpenAIApi } from "openai";
import type { NextApiRequest, NextApiResponse } from "next";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import ip from "ip";
import { encode } from "gpt-3-encoder";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

const redis = new Redis({
  url: String(process.env.UPSTASH_REDIS_REST_URL),
  token: String(process.env.UPSTASH_REDIS_REST_TOKEN)
});

// Create a new ratelimiter, that allows 5 requests per 5 seconds
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(5, "1 s")
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, Please add one to use this page"
      }
    });
    return;
  }

  // Rate Limit
  console.log(ip.address());
  const identifier = "ipAddress";
  const result = await ratelimit.limit(identifier);
  res.setHeader("X-RateLimit-Limit", result.limit);
  res.setHeader("X-RateLimit-Remaining", result.remaining);

  if (!result.success) {
    res.status(429).json({
      message: "The request has been rate limited.",
      rateLimitState: result
    });
    return;
  }
  const { messages }: { messages: string } = req.body;

  // Count tokens
  const parsed = JSON.parse(messages);
  const tokens = encode(parsed[parsed.length - 1].content);

  if (tokens.length >= 1000) {
    return res.status(400).send("Too much tokens");
  }

  if (!messages || messages.length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid message"
      }
    });
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: JSON.parse(messages),
      max_tokens: 1000,
      temperature: 0.6
    });
    res
      .status(200)
      .json({ result: completion.data.choices[0]?.message?.content });
  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request."
        }
      });
    }
  }
}
