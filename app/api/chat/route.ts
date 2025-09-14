//  In Next.js, you can create custom request handlers for a given route using Route Handlers. Route Handlers are defined in a route.ts file and can export HTTP methods like GET, POST, PUT, PATCH etc. https://nextjs.org/docs/app/api-reference/file-conventions/route

import { createResource } from '@/lib/actions/resources';
import { findRelevantContent } from '@/lib/ai/embedding';
import { openai } from '@ai-sdk/openai';
import {
  convertToModelMessages,
  streamText,
  tool,
  UIMessage,
  stepCountIs,
} from 'ai';
import { z } from 'zod';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


// Declare and export an asynchronous function called POST: retrieve the messages from the request body and then pass them to the streamText function imported from the AI SDK, alongside the model you would like to use. Finally, you return the model’s response in UIMessageStreamResponse format. https://ai-sdk.dev/cookbook/guides/rag-chatbot#create-api-route

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();


  // StreamText function, Streams text generations from a language model. https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text
  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    // Tools: actions that an LLM can invoke. The results of these actions can be reported back to the LLM to be considered in the next response. https://ai-sdk.dev/docs/foundations/tools
    tools: {
     
     // Add Resource tool has a description so the LLM knows when to use it, an input Zod schema that defines what the input needs to look like, and an ansyncronous function that will be called when the tool is used. In simple terms, on each generation, the model will decide whether it should call the tool. If it deems it should call the tool, it will extract the input and then append a new message to the messages array of type tool-call. The AI SDK will then run the execute function with the parameters provided by the tool-call message.
      addResource: tool({
        description: `add a resource to your knowledge base.
          If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        inputSchema: z.object({
          content: z
            .string()
            .describe('the content or resource to add to the knowledge base'),
        }),
        execute: async ({ content }) => createResource({ content }),
      }),

      // Find relevant content from the ai/embedding code
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        inputSchema: z.object({
          question: z.string().describe('the users question'),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}