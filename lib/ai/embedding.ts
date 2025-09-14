import { embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { db } from '../db';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { embeddings } from '../db/schema/embeddings';

// OpenAI embedding model
const embeddingModel = openai.embedding('text-embedding-ada-002');

// Generate chunks from the input, using . as a delimiter (to do: replace . with a better delimiter). This function will take an input string and split it by periods, filtering out any empty items. This will return an array of strings. It is worth experimenting with different chunking techniques in your projects as the best technique will vary.
const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split('.')
    .filter(i => i !== '');
};


// Generate embeddings for a resource that you add to the knowledge base. You create an asynchronous function called generateEmbeddings. This function will take in the source material (value) as an input and return a promise of an array of objects, each containing an embedding and content. Within the function, you first generate chunks for the input. Then, you pass those chunks to the embedMany function imported from the AI SDK which will return embeddings of the chunks you passed in. Finally, you map over and return the embeddings in a format that is ready to save in the database. https://ai-sdk.dev/cookbook/guides/rag-chatbot#generate-embeddings

export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  // Generate embeddings for the chunks https://ai-sdk.dev/docs/reference/ai-sdk-core/embed-many#embedmany
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

// Generate a single embedding from the chat input for a question (not for putting into the DB)

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ');
  // Generate a single embedding from the chat input for a question https://ai-sdk.dev/docs/reference/ai-sdk-core/embed#embed
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

// Find relevant content from the knowledge base from the questions above. Embed the user's query and then use the cosine distance to find the most similar content in the knowledge base. https://ai-sdk.dev/cookbook/guides/rag-chatbot#retrieve-resource-tool

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded,
  )})`;
  const similarGuides = await db
    .select({ name: embeddings.content, similarity })
    .from(embeddings)
    .where(gt(similarity, 0.5))
    .orderBy(t => desc(t.similarity))
    .limit(4);
  return similarGuides;
};