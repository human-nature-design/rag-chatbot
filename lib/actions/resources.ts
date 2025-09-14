// This function is a Server Action, as denoted by the “use server”; directive at the top of the file. This means that it can be called anywhere in your Next.js application . https://nextjs.org/docs/app/getting-started/updating-data#with-client-components
'use server';

import {
  NewResourceParams,
  insertResourceSchema,
  resources,
} from '@/lib/db/schema/resources';
import { db } from '../db';
import { generateEmbeddings } from '../ai/embedding';
import { embeddings as embeddingsTable } from '../db/schema/embeddings';


// Create a resource (and its embeddings in another table) in the DB. This function will take an input, run it through a Zod schema to ensure it adheres to the correct schema, and then creates a new resource in the database, with the embeddings generated for the content (from generateEmbeddings } from '../ai/embedding';). 
// https://ai-sdk.dev/cookbook/guides/rag-chatbot#generate-embeddings
export const createResource = async (input: NewResourceParams) => {
  try {
    // Parse the content of the chat input
    const { content } = insertResourceSchema.parse(input);

    // Create a new resource in the database
    const [resource] = await db
      .insert(resources)
      .values({ content })
      .returning();

    // Generate embeddings for the content
    const embeddings = await generateEmbeddings(content);
    await db.insert(embeddingsTable).values(
      embeddings.map(embedding => ({
        resourceId: resource.id,
        ...embedding,
      })),
    );

    return 'Resource successfully created and embedded.';
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : 'Error, please try again.';
  }
};